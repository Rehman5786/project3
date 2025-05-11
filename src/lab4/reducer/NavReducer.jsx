export default function NavReducer (state="page1",action){ switch(action.type){
    case"page":
    state = action.data; return state; default:
    return state;
    
    }
    }
    
    //action = {"type": "page","data": "page1"}
    