/**
 * Stack implemented with a maximum size.
 * Items at the bottom of the stack are removed when the maximum size is exceeded.
 */
export class CappedStack<T> {
	private maxSize: number;
	private stack: T[] = [];

	constructor(maxSize: number) {
		this.maxSize = maxSize;
	}

	push(value: T) {
		if (this.stack.length >= this.maxSize) {
			this.stack.shift();
		}
		this.stack.push(value);
	}

	pop() {
		return this.stack.pop();
	}
}
