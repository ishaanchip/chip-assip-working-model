import { useState, useEffect, use } from 'react'
import Header from './Header'
import './App.css'
import { Picker } from './Picker'
import { CATEGORIES, getDiagnosis, FIELDKEYMAP, getSeverity, fetchSymptomExtraction, fetchRandomReminder, SMISTEPS, NONSMISTEPS } from './helper'
import { Button, CloseButton, Alert, Icon, Switch, Spinner, Textarea } from '@chakra-ui/react'
import { FaMoon, FaSun } from "react-icons/fa"

function App() {


  const [clientAge, setClientAge] = useState(null);
  const [clientEducation, setClientEducation] = useState(null);
  const [clientEthnicity, setClientEthnicity] = useState(null);
  const [clientRace, setClientRace] = useState(null);
  const [clientGender, setClientGender] = useState(null);
  const [clientMH1, setClientMH1] = useState(null);
  const [clientMH2, setClientMH2] = useState(null);
  const [clientMH3, setClientMH3] = useState(null);
  const [clientMaritalStatus, setClientMaritalStatus] = useState(null);
  const [clientSAP, setClientSAP] = useState(null);
  const [clientLivingArrangement, setClientLivingArrangement] = useState(null);
  const [clientState, setClientState] = useState(null);
  const [clientDivision, setClientDivision] = useState(null);
  const [clientRegion, setClientRegion] = useState(null);

  const keyVariableMap = {
    "AGE": setClientAge,
    "EDUC": setClientEducation,
    "ETHNIC": setClientEthnicity,
    "RACE": setClientRace,
    "GENDER": setClientGender,
    "MH1": setClientMH1,
    "MH2": setClientMH2,
    "MH3": setClientMH3,
    "MARSTAT": setClientMaritalStatus,
    "SAP": setClientSAP,
    "LIVARAG": setClientLivingArrangement,
    "STATEFIP": setClientState,
    "DIVISION": setClientDivision,
    "REGION": setClientRegion
  };


  //accesibility & pure UI
  const [showAlert, setShowAlert] = useState(false)
  const [lightModeOn, setLightModeOn] = useState(false)

  //states & results
  const [callTranscript, setCallTranscript] = useState("")
  const [keyWords, setKeyWords] = useState([])
  const [symptom, setSymptom] = useState([])
  const [loadingSymptom,  setLoadingSymptom] = useState(false)
  const [results, setResults] = useState(null)
  const [loadingResults, setLoadingResults] = useState(false)

  const fetchSeverity = async() =>{

    const sampleClient = {
      AGE: clientAge.value[0],
      EDUC: clientEducation.value[0],
      ETHNIC: clientEthnicity.value[0],
      RACE: clientRace.value[0],
      GENDER: clientGender.value[0],
      MH1: clientMH1.value[0],
      MH2: clientMH2.value[0],
      MH3: clientMH3.value[0],
      MARSTAT: clientMaritalStatus.value[0],
      SAP: clientSAP.value[0],
      LIVARAG: clientLivingArrangement.value[0],
      STATEFIP: clientState.value[0],
      DIVISION: clientDivision.value[0],
      REGION: clientRegion.value[0],
    };
    const data = await getSeverity(sampleClient);
    return data
  }
  

  
  const handleFetchSeverity = async() =>{
    const allFieldsFilled =
    clientAge &&
    clientEducation &&
    clientEthnicity &&
    clientRace &&
    clientGender &&
    clientMH1 &&
    clientMH2 &&
    clientMH3 &&
    clientMaritalStatus &&
    clientSAP &&
    clientLivingArrangement &&
    clientState &&
    clientDivision &&
    clientRegion;
    if (allFieldsFilled){
      console.log('ready to send!')
      setShowAlert(false)
      setLoadingResults(true)
      let finalResults = await fetchSeverity()
      setResults(finalResults)
      setLoadingResults(false)

    }
    else{
      console.log('fill out all field!')
      setShowAlert(true)
    }
  }

  const handleFetchSymptomExtraction = async() =>{
    setLoadingSymptom(true)
    let finalData = await fetchSymptomExtraction(callTranscript)
    console.log(finalData)
    setSymptom(finalData['illness'])
    console.log(finalData['illness'])
    setKeyWords(finalData['keywords'])
    setLoadingSymptom(false)

  }


  return (
    <div className='app-shell'>
      <Header />
      <div className="main-area" style={lightModeOn ? {'color':'black', 'background':'white', 'transition':'0.4s'} : {'color':'white', 'background':'black', 'transition':'0.4s'} }>
      

        <div className="selection-field">

              {Object.keys(CATEGORIES).map((category) => {

                  {
                    return <Picker selectionCategory={FIELDKEYMAP[category]} selectionOptions={CATEGORIES[category]} setVariable={keyVariableMap[category]} className="picker"/>
                  }
              })}
              <div className="options">
                <Button className="submit-button" onClick={handleFetchSeverity}>approximate severity</Button>
                <Button className='submit-button' onClick={() => window.location.reload()}>clear fields</Button>
              </div>
              {
                showAlert &&
                <Alert.Root status="error" w="350px">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>ERROR</Alert.Title>
                  <Alert.Description>
                  Must complete all fields to determine severity
                  </Alert.Description>
                </Alert.Content>
                <CloseButton pos="relative" top="-2" insetEnd="-2" onClick={() => setShowAlert(false)}/>
              </Alert.Root>
              }
        </div>
        <div className="right-side">
          <div className="added-features" style={{display:'flex', justifyContent:'space-around', marginLeft:'-50px'}}>
            <Alert.Root status="error" w="500px" h="110px" fontSize="xs">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>DISCLAIMER</Alert.Title>
                    <Alert.Description>
                    Any output generated by the 988 Hotline Helper is intended solely to support the operator’s personal analysis.
  It should NOT be used to diagnose or definitively determine a caller’s condition.
                    </Alert.Description>
                  </Alert.Content>
            </Alert.Root>
            <Switch.Root colorPalette="blue" size="lg" onCheckedChange={() => setLightModeOn(!lightModeOn)}>
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
              <Switch.Indicator fallback={<Icon as={FaMoon} color="gray.400" />}>
                <Icon as={FaSun} color="yellow.400" />
              </Switch.Indicator>
            </Switch.Control>
          </Switch.Root>

          </div>

        <div className="output-area">
              <div className="text-area">
                <h3>Call Sense</h3>
                <Textarea resize="none" placeholder="Paste in call transcript..." value={callTranscript} onChange={(e) => setCallTranscript(e.target.value)}/>
                <Button className='submit-button' onClick={() => handleFetchSymptomExtraction()}>Extract Components</Button>
                {
                  loadingSymptom === true
                  ?
                  <Spinner size="xl" color="blue.400" style={{"display":"flex", "marginLeft":"35%"}}/>
                  :
                  <div className="text-results">
                    <div className="keywords-area">
                      <h3>Keywords: </h3>
                        <ul>
                        {
                          keyWords?.map((phrase, i) => (
                            <li key={`${phrase}-${i}`}>{phrase}</li>
                          ))
                        }
                        </ul>
                    <div className="illness-area">
                      <h3 style={{marginBottom:'5px'}}>Potential Illness based on call: </h3>
                      <ul>
                          {
                            symptom?.map((sym, i) => (
                              <li key={`${sym}-${i}`}>{sym}</li>
                            ))
                          }
                      </ul>
                    </div>
                    </div>

                  </div>

                }


              </div>
              <div className="results">
                {loadingResults ? (
                  <div className="loading-area">
                    <Spinner size="xl" color="blue.400" />
                    <h1>{fetchRandomReminder()}</h1>
                  </div>
                ) : (results === "SMI")? (
                  <div>
                    <h1>Determined: SMI client</h1>
                    {SMISTEPS.map((step, index) => (
                      <div className="step" key={index}>
                        <h1>{step.title}</h1>
                        <p>{step.detail}</p>
                      </div>
                    ))}
                  </div>
                ) : (results === "NOT SMI") ? (
                  <div>
                    <h1>Determined: non-SMI client</h1>
                    {NONSMISTEPS.map((step, index) => (
                      <div className="step" key={index}>
                        <h1>{step.title}</h1>
                        <p>{step.detail}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                  </div>
                )}
              </div>

              

        </div>



        </div>

      </div>

    </div>
  )
}

export default App



/*


  const [
    clientAge, setClientAge,
    clientEducation, setClientEducation,
    clientEthnicity, setClientEthnicity,
    clientRace, setClientRace,
    clientGender, setClientGender,
    clientMH1, setClientMH1,
    clientMH2, setClientMH2,
    clientMH3, setClientMH3,
    clientMaritalStatus, setClientMaritalStatus,
    clientSAP, setClientSAP,
    clientLivingArrangement, setClientLivingArrangement,
    clientState, setClientState,
    clientDivision, setClientDivision,
    clientRegion, setClientRegion
  ] = [
    useState(null), useState(null),
    useState(null), useState(null),
    useState(null), useState(null),
    useState(null), useState(null),
    useState(null), useState(null),
    useState(null), useState(null),
    useState(null), useState(null),
    useState(null)
  ];
  
  const keyVariableMap = {
    "AGE": setClientAge,
    "EDUC": setClientEducation,
    "ETHNIC": setClientEthnicity,
    "RACE": setClientRace,
    "GENDER": setClientGender,
    "MH1": setClientMH1,
    "MH2": setClientMH2,
    "MH3": setClientMH3,
    "MARSTAT": setClientMaritalStatus,
    "SAP": setClientSAP,
    "LIVARAG": setClientLivingArrangement,
    "STATEFIP": setClientState,
    "DIVISION": setClientDivision,
    "REGION": setClientRegion
  };
  

  useEffect(() =>{
    if (clientAge){
      console.log(clientAge)
    }
  }, [clientAge])

*/