import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispacth, AppStore } from "./store";


export const useAppDispatch = () => useDispatch<AppDispacth>()
export const useAppSelector: TypedUseSelectorHook<AppStore> = useSelector