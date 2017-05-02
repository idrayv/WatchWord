﻿export class Material {
    public materialType: MaterialType;

    public name: string;

    public description: string;

    public image: File

    public subtitles: File;
}

export enum MaterialType {
    Film,
    Series
}