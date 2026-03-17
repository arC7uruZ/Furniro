import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, PageServerLoadEvent } from "./$types";

export const load: PageServerLoad = (event: PageServerLoadEvent) => {
    const user = event.locals.user;

    if (!user) {
        redirect(302, "/login");
    }

    return {
        user: {
            firstName: "Welton",
            lastName: "Carvalho",
            email: "weltoncarvalhoo@gmail.com",
            profileImage: "/bg-1.png",
            dateOfBirth: new Date(1995, 9, 5).getTime(),
            gender: "Masculino",
            phones: [981805999, 44735309],
            address: [{
                street: "Rua Itaparica",
                number: 156,
                complement: "casa 2",
                city: "Santo André",
                state: "São Paulo",
                postalCode: "09280480",
            },{
                street: "Rua Lobo Guará",
                number: 396,
                complement: null,
                city: "Santo André",
                state: "São Paulo",
                postalCode: "09134110",
            }]
        }
    }
}