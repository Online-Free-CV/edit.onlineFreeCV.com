interface IRouteProps {
    url: string,
    name: string,
    label: string
}

export const ROUTES: IRouteProps[] = [
    {
        url: "/",
        label: "About Me",
        name: "Home"
    },
    {
        url: "/contact",
        label: "Contact",
        name: "Contact"
    },
]