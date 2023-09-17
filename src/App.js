import { MainView } from "./layout/main";
//alttaki 2 importun calısması icin
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
//alttaki importun calısması icin
import "../node_modules/primeflex/primeflex.css";
//alttaki importun calısması icin
import 'primeicons/primeicons.css';

const App = () => {
  return (
    <div className="App bg-blue-50 h-full">
      <MainView />
    </div>
  );
}

export default App;