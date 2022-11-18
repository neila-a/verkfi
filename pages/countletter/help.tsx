import HeadBar from "../../components/HeadBar";
function CountLetterHelp(): JSX.Element {
    return (
        <>
            <HeadBar isIndex={false} pageName="CountLetter帮助" />
            <div id="faq1">
                <p>F：这是什么东东？</p>
                <p>Q：CountLetter，一个帮你数字母的程序。</p>
            </div>
            <hr />
        </>
    );
};
export default CountLetterHelp;