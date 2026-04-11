/**
 * Common toast notifications (Sonner).
 * Import: import { toast } from '../utils/toast';
 *
 * Usage:
 *   toast.success('Done')
 *   toast.error(err.message)
 *   toast.info('For your information')
 *   toast.warning('Heads up')
 *   toast.loading('Saving...')
 *   toast.promise(myAsyncFn(), { loading: 'Saving...', success: 'Saved!', error: 'Failed' })
 */
export { toast } from 'sonner';
