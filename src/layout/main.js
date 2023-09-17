import { MainBody } from './body';
import { MainHeader } from './header';
import "../styles/components.css"

const MainView = () => {
    return (
        <div>
            <MainHeader />
            <MainBody />
        </div>
    )
}
export { MainView };