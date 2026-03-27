import { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./ModalSection.module.css"

interface ModalSectionProps {
    children: React.ReactNode; 
    onClose: () => void;
}

export default function ModalSection({ children, onClose }: ModalSectionProps) {
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
             document.documentElement.style.overflow = "";
         }
    }, [onClose])
    
    return createPortal(
        <div className={css.overlay} onClick={handleBackdropClick}>
            <div className={css.modal}>
               {children}
            </div>
        </div>, 
        document.body
    )
}