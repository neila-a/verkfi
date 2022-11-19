/**
 * 居中
 * @returns JSX.Element
 */
function Center(props) {
    return (
        <div style={{
            textAlign: "center"
        }}>
            {props.children}
        </div>
    );
};
export default Center;