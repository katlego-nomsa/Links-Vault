import { useMemo, useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { LinkDraft, LinkItem, Notification } from './types';
import Header from './components/Header';
import LinkGrid from './components/LinkGrid';
import Modal from './components/Modal';
import LinkForm from './components/LinkForm';
import ConfirmDialog from './components/ConfirmDialog';
import ToastStack from './components/ToastStack';
import FilterBar from './components/FilterBar';
import './App.css';

type ModalState =
  | { mode: 'closed' }
  | { mode: 'add' }
  | { mode: 'edit'; link: LinkItem }
  | { mode: 'delete'; link: LinkItem };

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const [links, setLinks] = useLocalStorage<LinkItem[]>('links-vault-items', []);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<ModalState>({ mode: 'closed' });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const notify = (message: string, type: Notification['type'] = 'success') => {
    const id = makeId();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3200);
  };

  // Search across title, url, description and tags, plus the active tag filter
  const filteredLinks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return links.filter((link) => {
      const matchesSearch =
        !q ||
        link.title.toLowerCase().includes(q) ||
        link.url.toLowerCase().includes(q) ||
        link.description.toLowerCase().includes(q) ||
        link.tags.some((tag) => tag.toLowerCase().includes(q));

      const matchesTag = !activeTag || link.tags.includes(activeTag);

      return matchesSearch && matchesTag;
    });
  }, [links, search, activeTag]);

  const sortedLinks = useMemo(() => {
    const sorted = [...filteredLinks].sort((a, b) => b.updatedAt - a.updatedAt);
    return sortOrder === 'newest' ? sorted : sorted.reverse();
  }, [filteredLinks, sortOrder]);

  // Every tag across all links (with duplicates), used to build the filter pills
  const allTags = useMemo(() => links.flatMap((link) => link.tags), [links]);

  const handleAdd = (draft: LinkDraft) => {
    const now = Date.now();
    const newLink: LinkItem = { id: makeId(), ...draft, createdAt: now, updatedAt: now };
    setLinks((prev) => [newLink, ...prev]);
    setModal({ mode: 'closed' });
    notify(`"${draft.title}" saved to your vault`, 'success');
  };

  const handleUpdate = (id: string, draft: LinkDraft) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...draft, updatedAt: Date.now() } : l))
    );
    setModal({ mode: 'closed' });
    notify(`"${draft.title}" updated`, 'success');
  };

  const handleDelete = (link: LinkItem) => {
    setLinks((prev) => prev.filter((l) => l.id !== link.id));
    setModal({ mode: 'closed' });
    notify(`"${link.title}" deleted`, 'info');
  };

  return (
    <div className="app-shell">
      <Header
        onAdd={() => setModal({ mode: 'add' })}
        search={search}
        onSearchChange={setSearch}
        resultCount={filteredLinks.length}
        totalCount={links.length}
      />

      <div className="app-container">
        <FilterBar
          tags={allTags}
          activeTag={activeTag}
          onSelectTag={setActiveTag}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          totalCount={links.length}
        />

        <LinkGrid
          links={sortedLinks}
          hasAnyLinks={links.length > 0}
          onEdit={(link) => setModal({ mode: 'edit', link })}
          onDelete={(link) => setModal({ mode: 'delete', link })}
          onTagClick={(tag) => setActiveTag(tag)}
          onAdd={() => setModal({ mode: 'add' })}
        />
      </div>

      {modal.mode === 'add' && (
        <Modal title="Add Link" onClose={() => setModal({ mode: 'closed' })}>
          <LinkForm onSubmit={handleAdd} onCancel={() => setModal({ mode: 'closed' })} />
        </Modal>
      )}

      {modal.mode === 'edit' && (
        <Modal title="Edit Link" onClose={() => setModal({ mode: 'closed' })}>
          <LinkForm
            initial={modal.link}
            onSubmit={(draft) => handleUpdate(modal.link.id, draft)}
            onCancel={() => setModal({ mode: 'closed' })}
          />
        </Modal>
      )}

      {modal.mode === 'delete' && (
        <ConfirmDialog
          title="Delete this link?"
          message={`"${modal.link.title}" will be permanently removed from your vault.`}
          onConfirm={() => handleDelete(modal.link)}
          onCancel={() => setModal({ mode: 'closed' })}
        />
      )}

      <ToastStack
        notifications={notifications}
        onDismiss={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
      />
    </div>
  );
}