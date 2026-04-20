import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { GlobalModal } from './components/GlobalModal';
import { WidgetView } from './components/WidgetView';

function App() {
  return (
    <>
      {/* Sistema de modal global mantido disponível em toda a aplicação */}
      <GlobalModal />
      
      {/* O "Guarda de Trânsito" implementado pelo React Router */}
      <BrowserRouter>
        <Routes>
          {/* 1. Rota exclusiva: Renderiza SÓ o painel limpo do Widget */}
          <Route path="/widget" element={<WidgetView />} />
          
          {/* 2. Rota padrão: Renderiza o site B2C completo (com cabeçalho, hero e rodapé) */}
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
