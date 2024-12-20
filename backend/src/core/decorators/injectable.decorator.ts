import { GenericClassDecorator, Type } from "../../typings/decorator";
export const Injectable = (): GenericClassDecorator<Type<any>> => {
    return (target: Type<any>) => {
        
    }
}