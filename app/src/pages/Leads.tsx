import { Inbox, Phone, Trash2 } from 'lucide-react';
import { useLeads } from '../lib/leads';
import { Badge, Button, Card, EmptyState, PageHeader, Td, Th } from '../components/ui';

export default function Leads() {
  const leads = useLeads((s) => s.leads);
  const markContacted = useLeads((s) => s.markContacted);
  const deleteLead = useLeads((s) => s.deleteLead);

  const newCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle={`Tenant enquiries from your listings — ${newCount} new`}
      />

      {leads.length === 0 ? (
        <EmptyState
          title="No leads yet"
          hint="When a tenant requests a visit from the Explore page, it shows up here."
        />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
              <tr>
                <Th>Tenant</Th>
                <Th>Phone</Th>
                <Th>PG</Th>
                <Th>Message</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leads.map((l) => (
                <tr key={l.id}>
                  <Td className="font-medium text-slate-900 dark:text-slate-100">{l.tenantName}</Td>
                  <Td>
                    <a href={`tel:${l.phone}`} className="inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400">
                      <Phone size={13} /> {l.phone}
                    </a>
                  </Td>
                  <Td>{l.pgName}</Td>
                  <Td className="max-w-[220px] truncate text-slate-500 dark:text-slate-400">{l.message || '—'}</Td>
                  <Td>{l.createdAt}</Td>
                  <Td>
                    <Badge tone={l.status === 'new' ? 'green' : 'slate'}>
                      {l.status === 'new' ? 'New' : 'Contacted'}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1">
                      {l.status === 'new' ? (
                        <Button variant="ghost" onClick={() => markContacted(l.id)}>
                          Mark contacted
                        </Button>
                      ) : null}
                      <button
                        onClick={() => deleteLead(l.id)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
