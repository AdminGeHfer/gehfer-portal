interface CollectionItemsProps {
  items: any[];
}

export function CollectionItems({ items }: CollectionItemsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="font-medium mb-2">Itens para Coleta</h4>
      <ul className="space-y-2">
        {items.map((item: any) => (
          <li key={item.id} className="flex justify-between items-center">
            <span>{item.product?.name || 'Produto não encontrado'}</span>
            <span>{item.weight}kg</span>
          </li>
        ))}
      </ul>
    </div>
  );
}