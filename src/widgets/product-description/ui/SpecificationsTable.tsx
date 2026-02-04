import type { SpecificationsTableProps } from "../model/interface";

export function SpecificationsTable({ attributes }: SpecificationsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full">
        <tbody className="divide-y">
          {attributes.map((attr, index) => (
            <tr
              key={attr.attribute_code}
              className={index % 2 === 0 ? "bg-muted/50" : ""}
            >
              <td className="px-6 py-3 text-sm font-medium">{attr.label}</td>
              <td className="px-6 py-3 text-sm text-muted-foreground">
                {attr.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
