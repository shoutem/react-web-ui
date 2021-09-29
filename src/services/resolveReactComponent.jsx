import React from 'react';

export default function resolveReactComponent(Component, props = {}) {
  if (!Component) {
    return null;
  }

  if (React.isValidElement(Component)) {
    return React.cloneElement(Component, props);
  }

  return <Component {...props} />;
}
