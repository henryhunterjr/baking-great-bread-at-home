
export const getPlaceholderImage = (index: number): string => {
  const placeholders = [
    "https://images.unsplash.com/photo-1635321313157-5be9fde3fcbb?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586444248879-bc604cbd555a?q=80&w=1000&auto=format&fit=crop"
  ];
  
  return placeholders[index % placeholders.length];
};
