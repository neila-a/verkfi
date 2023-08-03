import style from "../styles/Center.module.scss";
/**
 * 居中
 * @returns {JSX.Element}  
 */
export const Center = props => (
    <div className={style["center"]}>
        {props.children}
    </div>
);
export default Center;