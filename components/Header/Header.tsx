"use client";

import { useMediaQuery } from '@mantine/hooks';
import DesctopHeader from "../DesctopHeader/DesctopHeader";

const Header = () => {
    const isDesctop = useMediaQuery('(min-width: 1024px)');
   
    return (
        <>
            {isDesctop && <DesctopHeader />}
        </>
        )
};
 
export default Header;