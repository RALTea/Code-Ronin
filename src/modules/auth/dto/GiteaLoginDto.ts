import z from "zod";

export const GiteaLoginDtoSchema = z.string().min(1);

export type GiteaLoginDto = z.infer<typeof GiteaLoginDtoSchema>