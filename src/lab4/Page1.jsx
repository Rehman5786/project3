import './Style.css';
export default function Page1({store}){

function navigation(event){
store.dispatch({"type": "page", "data": event.currentTarget.getAttribute("val")})
}
return(
<div>
<a onClick={navigation} val={"Page1"}>Page 1</a>
<a onClick={navigation} val={"P2p1"}>Page 2</a>
<br/><br/><br/> This is Page 1
</div>
);

}
