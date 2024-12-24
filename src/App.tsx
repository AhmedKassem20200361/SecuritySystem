import { Provider } from "@/components/ui/provider";
import { Switch } from "@/components/ui/switch"

function App() {
  return (
    <Provider>
      <div className="w-full h-screen flex flex-col items-center justify-center gap-[150px] pt-32">
      <Switch scale="15"></Switch>
      <p className="text-[100px]">DOOR</p>      
      </div>
    </Provider>
  );
}

export default App;
