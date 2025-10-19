# TODO: Refactor `getApprenticeProfileSummary` Architecture

This document outlines a proposed refactoring for the `getApprenticeProfileSummary` feature to better align with CQRS principles, improve performance, and increase separation of concerns.

## Current Situation

The current implementation for fetching an apprentice's profile summary has the following issues:
1.  The `getProfileInfo` query method calculates the total `exp` even when it's not the primary data being requested by the corresponding API endpoint (`/getApprenticeInfos`).
2.  This leads to unnecessary database load and slower response times for endpoints that only need static profile information.
3.  The query layer interface `IApprenticeProfileSummaryQuery` has overlapping responsibilities, violating the Single Responsibility Principle.

## Proposed Refactoring Plan (Option 2)

The goal is to separate the read queries and compose them at the application/use case level.

### 1. Refine the Query Layer

The `IApprenticeProfileSummaryQuery` should be updated to have two distinct and efficient methods that do not overlap.

```typescript
// src/modules/learning/application/queries/IApprenticeProfileSummaryQuery.ts

// DTO for static info only
export type ApprenticeInfoDTO = {
	name: string;
	title?: string;
	avatar?: string;
	medals?: string[];
};

export interface IApprenticeProfileSummaryQuery {
	// This method should ONLY fetch static data.
	getProfileInfo(apprenticeId: string): Promise<ApprenticeInfoDTO | null>;

	// This method should ONLY calculate the experience.
	calculateTotalExp(apprenticeId: string): Promise<number>;
}
```
The `PrismaApprenticeProfileSummaryQuery` implementation should be updated to match this interface.

### 2. Create Granular Use Cases

Create three distinct use cases in the application layer.

1.  **`GetApprenticeInfoUseCase`**:
    -   Depends on `IApprenticeProfileSummaryQuery`.
    -   Calls `getProfileInfo()` and returns the `ApprenticeInfoDTO`.
    -   Used by the `/getApprenticeInfos` endpoint.

2.  **`CalculateApprenticeExpUseCase`**:
    -   Depends on `IApprenticeProfileSummaryQuery`.
    -   Calls `calculateTotalExp()` and returns the `number`.
    -   Used by the `/getApprenticeExp` endpoint.

3.  **`GetApprenticeProfileSummaryUseCase` (New)**:
    -   This is a new composite use case.
    -   It depends on the other two use cases (or directly on the query interface).
    -   It calls both `getProfileInfo()` and `calculateTotalExp()` and combines their results into the full `ApprenticeProfileSummary` DTO.
    -   This would be used by a new, consolidated API endpoint if one is needed in the future (e.g., `/getSummary`).

### 3. Update the Adapter Layer (tRPC Router)

The tRPC router should be wired to the new, granular use cases.

-   The `getApprenticeInfos` procedure will instantiate and call `GetApprenticeInfoUseCase`.
-   The `getApprenticeExp` procedure will instantiate and call `CalculateApprenticeExpUseCase`.

### Benefits of this Approach

-   **Performance**: Endpoints will only execute the exact queries needed, making the API faster.
-   **Separation of Concerns**: Each class (query, use case) has a single, clear responsibility.
-   **Flexibility**: The architecture can easily support the existing separate endpoints and any future consolidated endpoints without code duplication or inefficiency.
