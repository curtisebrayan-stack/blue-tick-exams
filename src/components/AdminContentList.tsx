import { Link } from "react-router-dom";
import { Plus, Trash2, ExternalLink } from "lucide-react";

type Item = { id: string; slug: string; title: string; isFree?: boolean };

export function AdminContentList<T extends Item>({
  items,
  viewPathPrefix,
  newPath,
  onDelete,
  deletingId,
}: {
  items: T[] | null;
  viewPathPrefix: string;
  newPath: string;
  onDelete: (id: string, title: string) => void;
  deletingId: string | null;
}) {
  return (
    <>
      <div className="mt-6 flex justify-end">
        <Link to={newPath} className="btn-primary">
          <Plus className="h-4 w-4" /> Nouveau
        </Link>
      </div>

      {items === null ? (
        <p className="mt-8 text-sm text-muted-foreground">Chargement...</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">Aucun contenu pour le moment.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="card-shell flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold">
                  {item.title}
                  {item.isFree !== undefined &&
                    (item.isFree ? (
                      <span className="chip ml-2">Gratuit</span>
                    ) : (
                      <span className="chip !bg-amber-500 ml-2">Premium</span>
                    ))}
                </p>
                <p className="text-xs text-muted-foreground">/{item.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`${viewPathPrefix}/${item.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline !px-3 !py-2 text-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Voir
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(item.id, item.title)}
                  disabled={deletingId === item.id}
                  className="btn-outline !px-3 !py-2 text-xs !border-red-300 !text-red-600 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> {deletingId === item.id ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
