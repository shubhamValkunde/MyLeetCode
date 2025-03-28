import React from "react";

export function Textarea({ className, ...props }) {
  return <textarea className={`form-control ${className}`} {...props} />;
}
