const fs = require('fs');
const file = 'C:/Users/Piyush/Desktop/hello/Project-samikaran/frontend/src/admin/AdminApp.jsx';
let content = fs.readFileSync(file, 'utf8');

const galleryAdminCode = `
const GalleryAdmin = ({ showToast }) => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title:'', description:'', image:'', is_active: true, sort_order: 0 });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const token = localStorage.getItem('admin_token') || '';

  const load = async () => {
    try {
      const res = await fetch(\`\${apiBase}/api/gallery\`);
      const data = await res.json();
      if (data.success) setItems(data.gallery);
    } catch (err) {
      showToast('Failed to load gallery', 'error');
    }
  };
  useEffect(()=>{ load(); },[]);

  const filteredItems = items.filter(m => 
    (m.title || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId ? \`\${apiBase}/api/gallery/\${editingId}\` : \`\${apiBase}/api/gallery\`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers:{ 'Content-Type':'application/json', Authorization: \`Bearer \${token}\` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) { 
        showToast(editingId ? 'Gallery Image updated' : 'Gallery Image added successfully');
        setForm({ title:'', description:'', image:'', is_active: true, sort_order: 0 }); 
        setEditingId(null);
        load(); 
        setIsFormOpen(false);
      } else {
        showToast(data.message || 'Operation failed', 'error');
      }
    } catch (err) {
      showToast('Connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (m) => {
    setEditingId(m.id);
    setForm({
      title: m.title || '',
      description: m.description || '',
      image: m.image || '',
      is_active: m.is_active !== undefined ? m.is_active : true,
      sort_order: m.sort_order || 0
    });
    setIsFormOpen(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title:'', description:'', image:'', is_active: true, sort_order: 0 });
    setIsFormOpen(false);
  };

  const remove = async () => {
    setLoading(true);
    try {
      const res = await fetch(\`\${apiBase}/api/gallery/\${confirmDelete.id}\`, { 
        method:'DELETE', 
        headers:{ Authorization: \`Bearer \${token}\` } 
      });
      const data = await res.json();
      if (data.success) {
        showToast('Image removed');
        setConfirmDelete({ open: false, id: null });
        load();
      }
    } catch (err) {
      showToast('Failed to remove entry', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <ConfirmModal 
        isOpen={confirmDelete.open} 
        title="Remove Image?" 
        message="This will remove the image from the Moments Gallery." 
        onConfirm={remove} 
        onCancel={() => setConfirmDelete({ open: false, id: null })} 
        loading={loading}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative group flex-1 w-full md:max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Gallery Images..." 
            className="pl-12 pr-6 py-3 rounded-xl bg-white border border-gray-200 shadow-sm outline-none transition-all w-full font-medium text-gray-900" 
          />
        </div>
        <ShinyButton 
          onClick={() => setIsFormOpen(!isFormOpen)} 
          variant={isFormOpen ? "danger" : "primary"}
          className="rounded-xl px-6 py-3"
        >
          {isFormOpen ? "Cancel" : "Add New Image"}
        </ShinyButton>
      </div>

      <FormModal isOpen={isFormOpen} title={editingId ? "Edit Image" : "Add Image"} onClose={cancelEdit}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <PremiumInput label="Image Title (Optional)" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g., Happy Kids" />
                <PremiumInput label="Sort Order" value={form.sort_order} onChange={e=>setForm({...form,sort_order:Number(e.target.value)})} placeholder="e.g., 0" />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Upload Image</label>
                  <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                              if (file.size > 2000000) return showToast('Image too large', 'error');
                              const reader = new FileReader();
                              reader.onloadend = () => setForm({...form, image: reader.result});
                              reader.readAsDataURL(file);
                          }
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-medium text-gray-800"
                  />
                  {form.image && <img src={form.image} alt="Preview" className="h-32 w-auto object-cover rounded-xl mt-2 border border-gray-200" />}
                </div>

                <div className="flex gap-4">
                  <ShinyButton className="flex-1" loading={loading}>
                    {editingId ? "Update Image" : "Save Image"}
                  </ShinyButton>
                </div>
              </form>
          </FormModal>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredItems.map((m)=>(
            <motion.div 
              key={m.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="h-48 bg-gray-50 relative overflow-hidden">
                <img 
                  src={m.image} 
                  className="w-full h-full object-cover" 
                  alt={m.title} 
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{m.title || 'Untitled'}</h3>
                <div className="flex gap-2 mt-auto justify-end">
                  <button onClick={() => startEdit(m)} className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"><Edit3 size={16} /></button>
                  <button onClick={()=>setConfirmDelete({ open: true, id: m.id })} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
`;

if (!content.includes('const GalleryAdmin')) {
  content = content.replace('const CarouselManager =', galleryAdminCode + '\nconst CarouselManager =');
}

// Add the tab
content = content.replace(
  `<button \n          onClick={() => setActiveTab('hero')}`, 
  `<button \n          onClick={() => setActiveTab('gallery')} \n          className={\`pb-2 px-4 text-sm font-bold transition-all \${activeTab === 'gallery' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-800'}\`}\n        >\n          Playbook Moments\n        </button>\n        <button \n          onClick={() => setActiveTab('hero')}`
);

// Add the renderer
content = content.replace(
  `{activeTab === 'hero' && <CarouselManager showToast={showToast} />}`,
  `{activeTab === 'gallery' && <GalleryAdmin showToast={showToast} />}\n      {activeTab === 'hero' && <CarouselManager showToast={showToast} />}`
);

fs.writeFileSync(file, content);
console.log('Done!');
