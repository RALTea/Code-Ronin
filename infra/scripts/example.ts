import {describe, expect, it} from 'vitest';

const printalphabet = () => {
	return 'abcdefghijklmnopqrstuvwxyz';
}

describe('StudentSolution:printalphabet', () => {
	it('should print the alphabet', () => {
		expect(printalphabet()).toBe('abcdefghijklmnopqrstuvwxyz');
	});
});
