import { IContainer } from '../gameobjects/container/IContainer';

export function SetSize (width: number, height: number, ...children: IContainer[]): IContainer[]
{
    children.forEach(child =>
    {
        child.setSize(width, height);
    });

    return children;
}
