import { SiteClient } from 'datocms-client'

export default async function recebedorDeRequests(request, response){

    if(request.method === 'POST'){
        const TOKEN = "f33d5bb4264c9001ed718d6107a0db";
        const client = new SiteClient(TOKEN);

        const registoCriado = await client.items.create({
            itemType: "970717",
            ...request.body,
        })


        response.json({
            dados: 'Algum dado qualquer',
            registoCriado: registoCriado,
        })
        return;
    }

    response.status(404).json({
        message: "Ainda não temos nada no GET, mas no POST tem!"
    })
}