import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box';
import {AlurakutMenu, OrkutNostalgicIconSet} from "../src/lib/AlurakutCommons";
import {ProfileRelationsBoxWrapper} from "../src/components/ProfileRelations";
import {useEffect, useState} from "react";

function ProfileSidebar(props){
    return(
        <Box>
            <img src={`https://github.com/${props.githubUser}.png`} style={{borderRadius: '4px'}} />
        </Box>
        )
}

function FollowingSidebar({githubUser}){
    const [follower, setFollower] = useState([]);

    useEffect(async () => {
        const url = `https://api.github.com/users/${githubUser}/followers`;
        const response = await fetch(url);
        setFollower(await response.json());
    }, []);

    const followers = follower.slice(0, 6);

    return(
        <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Pessoas da Comunidade ({followers.length})</h2>

            <ul>
                {followers.map((follower) =>{
                    return (
                        <li>
                            <a href={follower.html_url}>
                                <img src={`https://github.com/${follower.login}.png`} />
                                <span>{follower.login}</span>
                            </a>

                        </li>
                    )})}
            </ul>
        </ProfileRelationsBoxWrapper>
    )
}

export default function Home() {
    const githubUser = 'renatogama99';


  return (
      <>
          <AlurakutMenu />
          <MainGrid>
              <div className={"profileArea"} style={{gridArea: "profileArea;"}}>
                <ProfileSidebar githubUser={githubUser}/>
              </div>
              <div className={"welcomeArea"} style={{gridArea: "welcomeArea;"}}>
                  <Box>
                      <h1 className="title">Bem vindo(a) </h1>

                      <OrkutNostalgicIconSet></OrkutNostalgicIconSet>
                  </Box>
              </div>
              <div className={"profileRelationsArea"} style={{gridArea: "profileRelationsArea;"}}>
                  <FollowingSidebar githubUser={githubUser}>

                  </FollowingSidebar>
              </div>
          </MainGrid>
      </>
  )
}
