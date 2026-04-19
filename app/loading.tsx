"use client";

import React from "react";
import Image from "next/image";
import css from "./global-loading.module.css";

export default function Loading() {
  return (
    <div className={css.overlay}>
      <div className={css.loaderWrapper}>
        <div className={css.imageContainer}>
          <Image
            src="/images/Loading.png"
            alt="SpeedHub Loading"
            width={120}
            height={120}
            priority
            className={css.logo}
          />
        </div>

        <h2 className={css.text}>
          Speed<span>Hub</span>
        </h2>

        <div className={css.progressBar}>
          <div className={css.progressFill}></div>
        </div>
      </div>
    </div>
  );
}
