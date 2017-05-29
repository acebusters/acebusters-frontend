import styled from 'styled-components';

const TabContent = styled.div`
    display: ${(props) => props.active ? 'block' : 'none'};
`;

export default TabContent;
