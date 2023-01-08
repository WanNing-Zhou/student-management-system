import memoryUtils from "@/utils/memoryUtils";
import storageUtils from "@/utils/storageUtils";


export default {
    logout(){
        memoryUtils.user = {};
        storageUtils.removeUser();
        window.location.href="/login";
    },

    // 禁止回退页面
    pushHistory() {
    let state = {title: "title",url: "#"};
        window.history.pushState(state, "title", "#");
    }

}