import cn from 'classnames';
import { memo } from 'react';

import styles from '../assets/loading.module.scss';

interface ILoadingProps {
  size?: 'auto' | 'small' | 'medium' | 'large';
}

const Loading = memo(({ size = 'auto' }: ILoadingProps) => (
  <div className={styles.container} data-testid="loading-container">
    <div className={cn(styles.spinner, styles[size])} data-testid="loading-spinner" />
  </div>
));

Loading.displayName = 'Loading';

export default Loading;
