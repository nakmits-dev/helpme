import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Textarea from '../common/Textarea';

interface CreateThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => Promise<void>;
}

export default function CreateThreadModal({
  isOpen,
  onClose,
  onSubmit
}: CreateThreadModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await onSubmit(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      onClose();
    } catch (err) {
      setError('スレッドの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-2">
          <Plus className="h-5 w-5 text-primary-500" />
          <span>新規スレッド作成</span>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="スレッドのタイトルを入力"
          required
          maxLength={100}
          error={error}
          disabled={loading}
        />

        <Textarea
          label="説明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="スレッドの説明を入力"
          required
          maxLength={1000}
          disabled={loading}
          helperText="Shift + Enterで改行できます"
        />

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !title.trim() || !description.trim()}
          >
            {loading ? '作成中...' : '作成'}
          </button>
        </div>
      </form>
    </Modal>
  );
}