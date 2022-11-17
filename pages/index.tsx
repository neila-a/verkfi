import Router from "next/router";
import HeadBar from "../components/HeadBar";
function Index(): JSX.Element {
    return (
        <>
            <HeadBar isIndex={true} pageName="NeilaNotes" />
        </>
    );
}
export default Index;