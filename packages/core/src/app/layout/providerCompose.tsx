import {
    Context,
    ReactNode
} from "react";
type providerAndValue<value = any> = [Context<value>, value];
const composeProviders = (...providers: providerAndValue[]) => providers.reduce<(props: {
    children: ReactNode;
}) => JSX.Element>((Previous, current) => props => {
    const {
        Provider
    } = current[0];
    return (
        <Previous>
            <Provider value={current[1]}>
                {props.children}
            </Provider>
        </Previous>
    );
}, props => (
    <>
        {props.children}
    </>
));
export default composeProviders;