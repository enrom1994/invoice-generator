import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Skeleton, FormFieldSkeleton, CardSkeleton, InvoicePreviewSkeleton, PageLoader } from '../components/Skeleton';

describe('LoadingSpinner', () => {
  it('should render with default props', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render with custom label', () => {
    render(<LoadingSpinner label="Please wait" />);
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });

  it('should render small size', () => {
    render(<LoadingSpinner size="sm" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render large size', () => {
    render(<LoadingSpinner size="lg" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should have aria-live polite', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });
});

describe('Skeleton', () => {
  it('should render with default props', () => {
    render(<Skeleton />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render text variant', () => {
    render(<Skeleton variant="text" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render circular variant', () => {
    render(<Skeleton variant="circular" width={40} height={40} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render rectangular variant', () => {
    render(<Skeleton variant="rectangular" width={200} height={100} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render with custom dimensions', () => {
    render(<Skeleton width="100px" height="20px" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render with pulse animation', () => {
    render(<Skeleton animation="pulse" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render with wave animation', () => {
    render(<Skeleton animation="wave" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render with no animation', () => {
    render(<Skeleton animation="none" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

describe('FormFieldSkeleton', () => {
  it('should render form field skeleton', () => {
    const { container } = render(<FormFieldSkeleton />);
    // Check for presence of skeleton elements (multiple status roles)
    const skeletons = container.querySelectorAll('[role="status"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(1);
  });
});

describe('CardSkeleton', () => {
  it('should render card skeleton', () => {
    const { container } = render(<CardSkeleton />);
    const skeletons = container.querySelectorAll('[role="status"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(2);
  });
});

describe('InvoicePreviewSkeleton', () => {
  it('should render invoice preview skeleton', () => {
    const { container } = render(<InvoicePreviewSkeleton />);
    const skeletons = container.querySelectorAll('[role="status"]');
    expect(skeletons.length).toBeGreaterThanOrEqual(5);
  });
});

describe('PageLoader', () => {
  it('should render page loader with default message', () => {
    render(<PageLoader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render page loader with custom message', () => {
    render(<PageLoader message="Fetching data..." />);
    expect(screen.getByText('Fetching data...')).toBeInTheDocument();
  });

  it('should contain a loading spinner', () => {
    render(<PageLoader />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
