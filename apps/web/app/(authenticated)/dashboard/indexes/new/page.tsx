import { CreateIndexWizard } from './create-index-wizard';

export default function NewIndexPage() {
  return (
    <div className="w-full flex">
      <div className="w-full max-w-5xl">
        <CreateIndexWizard />
      </div>
    </div>
  );
}
