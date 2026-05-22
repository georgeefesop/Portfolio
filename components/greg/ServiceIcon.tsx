import { createElement } from 'react';
import { serviceIcon } from '@/data/greg/content';

/**
 * Renders a service's icon by id. Uses createElement so the dynamic icon
 * lookup does not trip the react-hooks/static-components lint rule in callers.
 */
export default function ServiceIcon({
  id,
  size = 20,
}: {
  id: string;
  size?: number;
}) {
  return createElement(serviceIcon(id), { size, 'aria-hidden': true });
}
