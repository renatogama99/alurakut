import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box';
import {AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from "../src/lib/AlurakutCommons";
import {ProfileRelationsBoxWrapper} from "../src/components/ProfileRelations";
import {useEffect, useState} from "react";
import React from 'react';
import axios from 'axios';

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
    return(
        <ul>
            {props.array.map((item, index) =>{
                if(index < 6){
                    return(
                        <li key={item.id}>
                            <a href={item.community || item.html_url} target="_blank">
                                <img src={item.image || item.avatar_url} />
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
        `http://api.github.com/users/${githubUser}/following`
    )
}

export default function Home() {
    const githubUser = 'renatogama99';
    const [follower, setFollower] = useState([]);
    const [following, setFollowing] = useState([]);

    useEffect(async () =>{
        const response = await getFollowers(githubUser);
        setFollower(response.data);
        const responseFollowing = await getFollowing(githubUser);
        setFollowing(responseFollowing.data);
    }, []);



    useEffect(async () =>{

    })

    const [comunidades, setComunidades] = React.useState([
        {
            id: '54732865434786734784',
            title: 'Eu odeio acordar cedo',
            image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg',
            community: '#'
        },
        {
            id: '16548921468321',
            title: 'Futebol Clube do Porto',
            image: 'https://pbs.twimg.com/profile_images/1019953936462221314/tq_OL5rv_400x400.jpg',
            community: '#'
        },
        {
            id: '5642315646',
            title: 'Futbol Club Barcelona',
            image: 'https://upload.wikimedia.org/wikipedia/pt/thumb/4/43/FCBarcelona.svg/1200px-FCBarcelona.svg.png',
            community: '#'
        }
    ]);

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
                      <OrkutNostalgicIconSet />
                  </Box>

                  <Box>
                      <h2 className="subTitle">O que você deseja fazer?</h2>

                      <form onSubmit={function handleCriaComunidade(e) {
                          e.preventDefault();
                          const dadosDoForm = new FormData(e.target);
                          const comunidade = {
                              id: new Date().toISOString(),
                              title : dadosDoForm.get('title'),
                              image: dadosDoForm.get('image'),
                              community: dadosDoForm.get("community")
                          };
                          setComunidades([...comunidades, comunidade]);
                          console.log(comunidade);
                          console.log(setComunidades);
                      }}>

                          <div>
                              <input placeholder="Qual vai ser o nome da sua comunidade?" name="title" aria-label="Qual vai ser o nome da sua comunidade?" type="text"/>
                          </div>
                          <div>
                              <input placeholder="Coloque uma URL para usarmos como capa" name="image" aria-label="Coloque uma URL para usarmos como capa" type="text"/>
                          </div>
                          <div>
                              <input placeholder="Coloque uma URL para a sua comunidade" name="community" aria-label="Coloque uma URL para a sua comunidade" type="text" />
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
                      <Cards array={follower} />
                  </ProfileRelationsBoxWrapper>
                  <ProfileRelationsBoxWrapper>
                      <h2 className="smallTitle">Pessoas que eu sigo ({following.length})</h2>
                      <Cards array={following} />
                  </ProfileRelationsBoxWrapper>
                  <ProfileRelationsBoxWrapper>
                      <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
                      <Cards array={comunidades} />
                  </ProfileRelationsBoxWrapper>
              </div>
          </MainGrid>
      </>
  )
}
