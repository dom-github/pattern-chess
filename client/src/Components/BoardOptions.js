import styled from "styled-components";

const BoardOptions = ({
    showBlkCtrl,
    showWhtCtrl,
    setShowBlkCtrl, 
    setShowWhtCtrl}) => {

    return (<>
        <Options>
            <Option>Black Control: <button onClick={() => {setShowBlkCtrl(showBlkCtrl === 1 ? 0 : 1)}}>show/hide</button></Option>
            <Spacer></Spacer>
            <Option>White Control:  <button onClick={() => {setShowWhtCtrl(showWhtCtrl === 1 ? 0 : 1)}}>show/hide</button></Option>
        </Options>
    </>
    )
}

const Options = styled.div`
    border: 1px solid whitesmoke;
    margin-top: 20px;
    
    width: 95%;
  @media (min-width: 1280px) {
    width: 25vw;
    height: auto;
  }
    min-height: 100px;
    padding: 10px 20px;
`

const Option = styled.div`
`
const Spacer = styled.div`
height: 10px;
`

export default BoardOptions