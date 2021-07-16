import React from 'react';
import axios from 'axios';
import nookies from "nookies";
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box';
import {AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from "../src/lib/AlurakutCommons";
import {ProfileRelationsBoxWrapper} from "../src/components/ProfileRelations";
import {useEffect, useState} from "react";

function ProfileSidebar(props){
    return(
        <Box as="aside">
            <img src={`https://github.com/${props.githubUser}.png`} style={{borderRadius: '4px'}} />
            <hr />
            <p>
                <a className="boxLink" href={`https://github.com/${props.githubUser}`}>@{props.githubUser}</a>
            </p>
            <hr />

            <AlurakutProfileSidebarMenuDefault />
        </Box>
    );
}
 function Cards(props){
    return (
        <ul>
            {props.array.map((item, index) =>{
                if(index < 6){
                    return(
                        <li key={item.id}>
                            <a href={item.communityLink || item.html_url} target="_blank">
                                <img src={item.imageUrl || item.avatar_url} />
                                <span>{item.title || item.login}</span>
                            </a>
                        </li>
                    );
                }
            })}
        </ul>
    );
}


async function getFollowers(githubUser){
    return await axios.get(
        `https://api.github.com/users/${githubUser}/followers`
    );
}

async function getFollowing(githubUser){
    return await axios.get(
        `https://api.github.com/users/${githubUser}/following`
    )
}

export default function Home(props) {
    const githubUser = props.githubUser;
    const [follower, setFollower] = useState([]);
    const [following, setFollowing] = useState([]);
    const [comunidades, setComunidades] = React.useState([]);


    React.useEffect(async () => {
        const responseFollower = await getFollowers(githubUser);
        setFollower(responseFollower.data);
        const responseFollowing = await getFollowing(githubUser);
        setFollowing(responseFollowing.data);

        fetch('https://graphql.datocms.com/', {
            method: 'POST',
            headers: {
                'Authorization': 'e870444912cfe219848097b957f64c',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "query": `query {
            allCommunities {
                id
                title
                imageUrl
                communityLink
                creatorSlut
                }
            }`
            })
        })
            .then((response) => response.json())
            .then((respostaCompleta) => {
                const comunidadesDato = respostaCompleta.data.allCommunities;
                setComunidades(comunidadesDato);
            })
    }, []);


    return (
        <>
            <AlurakutMenu githubUser={githubUser}/>
            <MainGrid>
                <div className="profileArea" style={{gridArea: "profileArea;"}}>
                    <ProfileSidebar githubUser={githubUser}/>
                </div>

                <div className="welcomeArea" style={{gridArea: "welcomeArea;"}}>
                    <Box>
                        <h2 className="smallTitle">Bem vindo, Renato Gama</h2>
                        <OrkutNostalgicIconSet/>
                    </Box>

                    <Box>
                        <h2 className="subTitle">O que você deseja fazer?</h2>

                        <form onSubmit={function handleCriaComunidade(e) {
                            e.preventDefault();
                            const dadosDoForm = new FormData(e.target);

                            const comunidade = {
                                title: dadosDoForm.get('title'),
                                imageUrl: dadosDoForm.get('image'),
                                communityLink: dadosDoForm.get("community"),
                                creatorSlut: githubUser
                            }

                            fetch('/api/comunidades', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(comunidade)
                            })
                                .then(async (response) => {
                                    const dados = await response.json();
                                    const comunidade = dados.registroCriado;
                                    setComunidades([...comunidades, comunidade]);
                                })

                        }}>
                            <div>
                                <input placeholder="Qual vai ser o nome da sua comunidade?" name="title"
                                       aria-label="Qual vai ser o nome da sua comunidade?" type="text"/>
                            </div>
                            <div>
                                <input placeholder="Coloque uma URL para usarmos como capa" name="image"
                                       aria-label="Coloque uma URL para usarmos como capa" type="text"/>
                            </div>
                            <div>
                                <input placeholder="Coloque uma URL para a sua comunidade" name="community"
                                       aria-label="Coloque uma URL para a sua comunidade" type="text"/>
                            </div>

                            <button>
                                Criar Comunidade
                            </button>
                        </form>
                    </Box>
                </div>
                <div className="profileRelationsArea" style={{gridArea: "profileRelationsArea;"}}>
                    <ProfileRelationsBoxWrapper>
                        <h2 className="smallTitle">Pessoas da Comunidade ({follower.length})</h2>
                        <Cards array={follower}/>
                    </ProfileRelationsBoxWrapper>
                    <ProfileRelationsBoxWrapper>
                        <h2 className="smallTitle">Pessoas que eu sigo ({following.length})</h2>
                        <Cards array={following}/>
                    </ProfileRelationsBoxWrapper>
                    <ProfileRelationsBoxWrapper>
                        <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
                        <Cards array={comunidades}/>
                    </ProfileRelationsBoxWrapper>
                </div>
            </MainGrid>
        </>
    )
}

export async function getServerSideProps(context) {
    const cookies = nookies.get(context);
    const token = cookies.USER_TOKEN;

    const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
        headers: {
            Authorization: token
        }
    }) .then((resposta) => resposta.json())

    console.log(isAuthenticated);

    //Comentado por erro de API
    if(!isAuthenticated){
        return{
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }

    const {githubUser} = jwt.decode(token);
    return {
        props: {
            githubUser
        },
    }
}