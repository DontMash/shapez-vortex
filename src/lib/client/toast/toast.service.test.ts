// @vitest-environment happy-dom
import { describe, it, expect, beforeAll, afterAll, vi, beforeEach, afterEach } from 'vitest';
import type { Unsubscriber } from 'svelte/store';

import { ToastType, type Toast, subscribe, add } from './toast.service';

describe('ToastService', () => {
	describe('add', () => {
		let unsubscribe: Unsubscriber;
		let currentToast: Toast | undefined;
		beforeAll(() => {
			unsubscribe = subscribe((toast) => (currentToast = toast));
		});
		afterAll(() => {
			if (!unsubscribe) return;
			unsubscribe();
		});
		beforeEach(() => {
			vi.useFakeTimers();
		});
		afterEach(() => {
			vi.runAllTimers();
			vi.restoreAllMocks();
		});

		it('should instantly dispatch toast event', () => {
			const mockToast: Toast = {
				message: 'Test',
				duration: 2000,
				type: ToastType.Warning
			};

			add(mockToast.message, mockToast.duration, mockToast.type);

			expect(currentToast).toEqual(mockToast);
		});
		it('should dispatch next toast after duration', () => {
			const mockToast1: Toast = {
				message: 'Test1',
				duration: 500,
				type: ToastType.Warning
			};
			const mockToast2: Toast = {
				message: 'Test2',
				duration: 1000,
				type: ToastType.Error
			};

			add(mockToast1.message, mockToast1.duration, mockToast1.type);
			add(mockToast2.message, mockToast2.duration, mockToast2.type);

			expect(currentToast).toEqual(mockToast1);

			const timeBefore = Date.now();
			vi.advanceTimersByTime(mockToast1.duration);
			const timeAfter = Date.now();

			expect(currentToast).toEqual(mockToast2);
			expect(timeAfter).toBe(timeBefore + mockToast1.duration);
		});
	});
});
