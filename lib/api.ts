import { Test } from "@/types/tests"
import axios from "axios"

export const getTestsByTheme = async (id: string) => {
    const res = await axios.get<Test[]>("https://speedhub-6fam.onrender.com/api/questions/search-by-unit", {
        params: {
            id,
        }
    });
    return res.data;
}


export const getExamTest = async () => {
    const res = await axios.get<Test[]>("https://speedhub-6fam.onrender.com/api/questions/test");
    return res.data;
}
