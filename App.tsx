
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  LayoutDashboard, 
  Search, 
  Heart, 
  Share2, 
  Settings, 
  Plus, 
  TrendingUp, 
  Trash2, 
  ExternalLink,
  Copy,
  Zap,
  Globe,
  Bell,
  Smartphone,
  Facebook,
  Instagram,
  MessageCircle,
  Link2,
  Lock,
  RefreshCcw,
  CheckCircle2,
  Calendar,
  Send
} from 'lucide-react';
import { Product, Stats } from './types';
import { generateSocialCopy, fetchMarketTrends } from './services/geminiService';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scanner' | 'automation' | 'account'>('dashboard');
  const [isAdding, setIsAdding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [affiliateId, setAffiliateId] = useState(localStorage.getItem('magalu_aff_id') || '');
  const [generatingFor, setGeneratingFor] = useState<{product: Product, platform: 'instagram' | 'whatsapp' | 'facebook'} | null>(null);
  const [generatedCopy, setGeneratedCopy] = useState<string>('');
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Eletrodomésticos' });

  useEffect(() => {
    const saved = localStorage.getItem('magalu_pro_v3_data');
    if (saved) setProducts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('magalu_pro_v3_data', JSON.stringify(products));
    localStorage.setItem('magalu_aff_id', affiliateId);
  }, [products, affiliateId]);

  const handleFetchTrends = async () => {
    if (!affiliateId) {
      alert("Por favor, configure seu ID de Afiliado na aba 'Minha Conta' primeiro.");
      setActiveTab('account');
      return;
    }
    setIsSyncing(true);
    const trends = await fetchMarketTrends(affiliateId);
    setProducts(prev => [...trends, ...prev.filter(p => !trends.find(t => t.name === p.name))].slice(0, 20));
    setIsSyncing(false);
  };

  const stats: Stats = {
    totalAnalyzed: products.length,
    avgConversion: products.length ? Math.round(products.reduce((acc, p) => acc + p.score, 0) / products.length) : 0,
    favoritesCount: products.filter(p => p.favorite).length,
    topScore: products.length ? Math.max(...products.map(p => p.score)) : 0,
    estimatedCommission: products.reduce((acc, p) => acc + (p.price * 0.04), 0)
  };

  const startGeneration = async (product: Product, platform: 'instagram' | 'whatsapp' | 'facebook') => {
    setGeneratingFor({ product, platform });
    setGeneratedCopy('');
    const copy = await generateSocialCopy(product, platform);
    setGeneratedCopy(copy);
  };

  return (
    <div className="min-h-screen flex bg-[#f0f4f8] text-slate-900">
      {/* Sidebar Profissional */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen z-40">
        <div className="p-8">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-200">
              <BarChart3 className="text-white w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tighter text-blue-700 block leading-none">MAGALU</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Afiliados PRO</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'scanner', label: 'Scanner de Ofertas', icon: Search },
            { id: 'automation', label: 'Automação Social', icon: Smartphone },
            { id: 'account', label: 'Minha Conta', icon: Lock },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl transition-all font-bold ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden group">
             <div className="relative z-10">
                <p className="text-xs font-black text-blue-400 mb-2 uppercase tracking-widest">Status da IA</p>
                <div className="flex items-center space-x-2 mb-4">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   <span className="text-sm font-bold">Monitorando Magalu</span>
                </div>
                <button 
                  onClick={handleFetchTrends}
                  disabled={isSyncing}
                  className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all"
                >
                  <RefreshCcw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Sincronizando...' : 'Puxar Top Ofertas'}</span>
                </button>
             </div>
             <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
          </div>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-10 py-6 flex items-center justify-between">
           <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
             {activeTab === 'dashboard' && 'Visão Geral'}
             {activeTab === 'scanner' && 'Scanner de Mercado'}
             {activeTab === 'automation' && 'Hub Social'}
             {activeTab === 'account' && 'Configurações PRO'}
           </h1>
           
           <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-slate-50 p-2 pr-5 rounded-2xl border border-slate-100">
                 <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                    {affiliateId ? affiliateId.charAt(0).toUpperCase() : '?'}
                 </div>
                 <div>
                    <p className="text-xs font-black text-slate-800 uppercase leading-none mb-1">{affiliateId || 'Configurar ID'}</p>
                    <p className="text-[10px] text-green-600 font-bold uppercase">Afiliado Verificado</p>
                 </div>
              </div>
           </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto space-y-10">
          {activeTab === 'dashboard' && (
            <div className="space-y-10 animate-fadeIn">
              {/* Cards de Métricas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {[
                   { label: 'Scanner Ativo', value: stats.totalAnalyzed, icon: Search, color: 'blue' },
                   { label: 'Score Médio', value: `${stats.avgConversion}%`, icon: Zap, color: 'orange' },
                   { label: 'Comissão Est.', value: `R$ ${stats.estimatedCommission.toFixed(0)}`, icon: BarChart3, color: 'green' },
                   { label: 'Rank Social', value: 'Top 5%', icon: Globe, color: 'purple' },
                 ].map((s, idx) => (
                   <div key={idx} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all">
                      <div className={`w-12 h-12 rounded-2xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center mb-6`}>
                        <s.icon className="w-6 h-6" />
                      </div>
                      <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{s.label}</p>
                      <h3 className="text-3xl font-black text-slate-800">{s.value}</h3>
                   </div>
                 ))}
              </div>

              {/* Seção Central */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                       <h3 className="text-xl font-black text-slate-800">🔥 Melhores para Postar Agora</h3>
                       <button onClick={handleFetchTrends} className="text-blue-600 font-bold text-sm hover:underline">Ver Todos</button>
                    </div>
                    <div className="divide-y divide-slate-50">
                       {products.slice(0, 4).map(p => (
                         <div key={p.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center space-x-6">
                               <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center font-black text-slate-500 text-xl border border-slate-200">
                                  {p.score}%
                               </div>
                               <div>
                                  <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{p.name}</h4>
                                  <p className="text-sm text-slate-400 font-bold uppercase tracking-tighter">R$ {p.price.toLocaleString('pt-BR')} • {p.category}</p>
                               </div>
                            </div>
                            <div className="flex items-center space-x-2">
                               <button onClick={() => startGeneration(p, 'whatsapp')} className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100"><MessageCircle className="w-5 h-5" /></button>
                               <button onClick={() => startGeneration(p, 'instagram')} className="p-3 bg-pink-50 text-pink-600 rounded-2xl hover:bg-pink-100"><Instagram className="w-5 h-5" /></button>
                               <a href={p.link} target="_blank" className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100"><ExternalLink className="w-5 h-5" /></a>
                            </div>
                         </div>
                       ))}
                       {products.length === 0 && (
                         <div className="p-20 text-center flex flex-col items-center">
                            <RefreshCcw className="w-12 h-12 text-slate-200 mb-4 animate-bounce" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest">Nenhuma oferta carregada.</p>
                            <button onClick={handleFetchTrends} className="mt-4 text-blue-600 font-black">PUXAR AGORA</button>
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
                    <div className="relative z-10 h-full flex flex-col">
                       <Zap className="w-12 h-12 text-yellow-400 mb-8" />
                       <h3 className="text-2xl font-black mb-4 leading-tight uppercase">Automação Inteligente</h3>
                       <p className="text-blue-100 font-medium opacity-80 mb-8 leading-relaxed">
                         Nossa IA analisa as variações de preço no Magalu e te avisa quando o score de conversão ultrapassa 90%.
                       </p>
                       <div className="mt-auto space-y-4">
                          <div className="bg-white/10 p-5 rounded-3xl border border-white/10 flex items-center justify-between">
                             <div className="flex items-center space-x-3">
                                <Calendar className="w-5 h-5 text-blue-300" />
                                <span className="font-bold text-sm">Postagens Agendadas</span>
                             </div>
                             <span className="bg-blue-500 text-[10px] px-2 py-1 rounded-lg font-black">04</span>
                          </div>
                          <button className="w-full bg-white text-blue-700 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-lg">
                             Configurar Auto-Post
                          </button>
                       </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="max-w-2xl mx-auto space-y-10 animate-fadeIn">
               <div className="bg-white rounded-[48px] p-12 border border-slate-100 shadow-sm">
                  <h2 className="text-3xl font-black mb-8 text-slate-800">Perfil do Afiliado</h2>
                  <div className="space-y-8">
                     <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Seu ID / Nome da Loja Magalu</label>
                        <input 
                          value={affiliateId}
                          onChange={e => setAffiliateId(e.target.value)}
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] px-8 py-5 font-black text-blue-600 text-lg focus:border-blue-600 focus:bg-white outline-none transition-all"
                          placeholder="Ex: lojadomagaluzin"
                        />
                        <p className="mt-4 text-xs text-slate-400 font-bold leading-relaxed">
                          Este ID é essencial para transformar links comuns em links de comissão. <br/>
                          Ex: magazineluiza.com.br/p/12345?seller_id=<b>{affiliateId || 'SEU_ID'}</b>
                        </p>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col items-center text-center">
                           <CheckCircle2 className="w-10 h-10 text-blue-500 mb-4" />
                           <h4 className="font-black text-slate-800 text-sm uppercase">Links Ativos</h4>
                           <p className="text-[10px] text-slate-400 font-bold mt-1">Sincronização OK</p>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col items-center text-center opacity-50">
                           <Facebook className="w-10 h-10 text-slate-300 mb-4" />
                           <h4 className="font-black text-slate-800 text-sm uppercase">FB Ads</h4>
                           <p className="text-[10px] text-slate-400 font-bold mt-1">Upgrade Necessário</p>
                        </div>
                     </div>

                     <button 
                        onClick={() => alert("Configurações salvas com sucesso!")}
                        className="w-full bg-slate-900 text-white py-6 rounded-[24px] font-black shadow-2xl shadow-slate-200 hover:scale-[1.02] transition-all"
                     >
                        Salvar Configurações
                     </button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'scanner' && (
             <div className="space-y-8 animate-fadeIn">
                <div className="flex items-center justify-between">
                   <div>
                      <h2 className="text-3xl font-black text-slate-800">Scanner Inteligente</h2>
                      <p className="text-slate-500 font-bold">Analisando o catálogo Magalu em tempo real</p>
                   </div>
                   <button 
                     onClick={handleFetchTrends}
                     className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-100 flex items-center space-x-2"
                   >
                     <RefreshCcw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                     <span>Escanear Agora</span>
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {products.map(p => (
                      <div key={p.id} className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm relative group overflow-hidden transition-all hover:shadow-2xl">
                         <div className="flex justify-between items-start mb-8">
                            <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase">SCORE {p.score}%</span>
                            <button onClick={() => setProducts(products.filter(item => item.id !== p.id))} className="text-slate-200 hover:text-red-500 transition-colors">
                               <Trash2 className="w-5 h-5" />
                            </button>
                         </div>
                         <h4 className="text-lg font-black text-slate-800 mb-2 line-clamp-2 min-h-[3.5rem] leading-tight">{p.name}</h4>
                         <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">{p.category}</p>
                         <div className="text-3xl font-black text-blue-600 mb-8">R$ {p.price.toLocaleString('pt-BR')}</div>
                         
                         <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => startGeneration(p, 'whatsapp')} className="bg-green-600 text-white py-4 rounded-2xl font-black text-xs hover:bg-green-700 transition-all flex items-center justify-center space-x-2">
                               <MessageCircle className="w-4 h-4" />
                               <span>Whats</span>
                            </button>
                            <button onClick={() => startGeneration(p, 'instagram')} className="bg-slate-900 text-white py-4 rounded-2xl font-black text-xs hover:bg-black transition-all flex items-center justify-center space-x-2">
                               <Instagram className="w-4 h-4" />
                               <span>Insta</span>
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      </main>

      {/* Modal de Geração de Copy / Automação */}
      {generatingFor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[48px] w-full max-w-2xl shadow-2xl overflow-hidden animate-slideUp">
             <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-5">
                   <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200"><Zap className="text-white w-6 h-6" /></div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-800">Copy de Alta Conversão</h3>
                      <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{generatingFor.platform}</p>
                   </div>
                </div>
                <button onClick={() => setGeneratingFor(null)} className="text-slate-300 hover:text-slate-600 transition-colors">
                   <Trash2 className="w-6 h-6" />
                </button>
             </div>
             <div className="p-12">
                {!generatedCopy ? (
                   <div className="py-20 flex flex-col items-center justify-center space-y-6">
                      <div className="relative">
                         <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600"></div>
                         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <Zap className="w-6 h-6 text-blue-600 animate-pulse" />
                         </div>
                      </div>
                      <p className="font-black text-slate-400 uppercase tracking-widest animate-pulse">IA Estrategista Criando...</p>
                   </div>
                ) : (
                   <div className="space-y-10">
                      <div className="bg-slate-50 p-10 rounded-[40px] font-bold text-slate-700 leading-relaxed border-2 border-slate-100 text-lg whitespace-pre-wrap">
                         {generatedCopy}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <button 
                           onClick={() => {
                             navigator.clipboard.writeText(generatedCopy);
                             alert('Conteúdo copiado com sucesso!');
                           }}
                           className="bg-slate-900 text-white py-6 rounded-3xl font-black flex items-center justify-center space-x-3 hover:bg-black transition-all shadow-xl shadow-slate-200"
                         >
                           <Copy className="w-5 h-5" />
                           <span>Copiar Texto</span>
                         </button>
                         <button 
                           onClick={() => {
                             const url = generatingFor.platform === 'whatsapp' 
                               ? `https://wa.me/?text=${encodeURIComponent(generatedCopy)}`
                               : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generatingFor.product.link)}`;
                             window.open(url, '_blank');
                           }}
                           className="bg-blue-600 text-white py-6 rounded-3xl font-black flex items-center justify-center space-x-3 shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all"
                         >
                           <Send className="w-5 h-5" />
                           <span>Postar Agora</span>
                         </button>
                      </div>
                      <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                         O link de afiliado <b>{affiliateId}</b> foi injetado automaticamente na copy.
                      </p>
                   </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
