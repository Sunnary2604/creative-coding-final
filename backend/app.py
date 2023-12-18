
import json
import os
import re
import openai
from flask import Flask, redirect, render_template, request, url_for
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
key_path = "./api.txt"
with open(key_path, 'r') as f:
    openai.api_key = f.read().strip()
    

os.environ["http_proxy"] = "127.0.0.1:7890"
os.environ["https_proxy"] = "127.0.0.1:7890"

messages = []

@app.route("/initiate", methods=("GET", "POST"))
def initiate():
    if request.method == "POST":
        data = request.get_data().decode("utf-8")
        result = json.loads(data)
        keyword= result["keyword"]

       
        append_message(
            "user", generate_prompt_initiate(keyword))
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
        )
        log_used_prompt(response, "Step0: Get story")
        append_message("assistant", response.choices[0].message.content)
        return response.choices[0].message.content
    result = request.args.get("result")
    return result

def generate_prompt_initiate(keyword):
    few_shot=formalize_few_shot_prompt("./prompt/Step0-initiate.json")
    store = ["Rich", "Healthy", "Loved", "Successful", "Happy", "Wealthy", "Prosperous", "Content", "Fulfilled", "Peaceful", "Strong", "Wise", "Generous", "Lucky", "Creative", "Confident", "Independent", "Adventurous", "Grateful", "Inspiring"]

    prompt = """Imagine you're a storyteller. Give one simple short description about the wish of the keyword{}. Also return 3 related keywords include but not limited in the list {}. Here are some examples:
    {}
    :""".format(keyword, store,few_shot)
    return prompt


@app.route("/getKeywords", methods=("GET", "POST"))
def getKeywords():
    if request.method == "POST":
        data = request.get_data().decode("utf-8")
        result = json.loads(data)
        user_input = result["user_input"]
        append_message(
            "user", generate_prompt_keywords(user_input))
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
        )
        log_used_prompt(response, "Step1: GEt Related Keywords")
        append_message("assistant", response.choices[0].message.content)
        return response.choices[0].message.content
    result = request.args.get("result")
    return result

def generate_prompt_keywords(user_input):
    few_shot=formalize_few_shot_prompt("./prompt/Step1-keyword.json")
    prompt = """Think as a creative story writer. I am writing an exciting story. Please brainstorm 3 elements that relate to the keyword and be the symble of the keyword. Be surprising, and be careful not to use the most direct and simple associations. Keep the word simple to understand for nont-native speakers. Give me the structured result in list, following the example below:
    {}
    Input: {}
    Output:""".format(few_shot,user_input)
    return prompt



@app.route("/getStory", methods=("GET", "POST"))
def getStory():
    if request.method == "POST":
        data = request.get_data().decode("utf-8")
        result = json.loads(data)
        keywords = result["keywords"]

        append_message(
            "user", generate_prompt_story(keywords))
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
        )
        log_used_prompt(response, "Step2: Get story")
        append_message("assistant", response.choices[0].message.content)
        return response.choices[0].message.content
    result = request.args.get("result")
    return result

def generate_prompt_story(keywords):
    # read file
    #
    structure= load_prompt("./prompt/Domain-Knowledge.txt")
    few_shot=formalize_few_shot_prompt("./prompt/Step2-story.json")
    prompt = """Imagine you're a storyteller. 
    [Instruction]:Please using the five keyword, write a narative 5 line poem with the following structure {}. The poem should be about making a with come true. Each sentence should not more than 10 words. Only use one sentence for each part, corrosponsing to one keyword. Make the poem as interesting as possible, and coherent.
     {}
    Input:{}
    Output:
    :""".format(structure,few_shot,keywords)
    return prompt




@app.route("/checkStory", methods=("GET", "POST"))
def checkStory():
    if request.method == "POST":
        data = request.get_data().decode("utf-8")
        result = json.loads(data)
        story = result["story"]
        wish = result["wish"]
    
       
        append_message(
            "user", generate_prompt_check(story,wish))
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
        )
        log_used_prompt(response, "Step2: Get story")
        append_message("assistant", response.choices[0].message.content)
        return response.choices[0].message.content
    result = request.args.get("result")
    return result

def generate_prompt_check(story,wish):
    # read file
    #
    few_shot=formalize_few_shot_prompt("./prompt/Step3-evaluate.json")
    prompt = """Imagine you're a storyteller. 
    Evaluate the following poem, whether satiefied (1) or not satisfied (0) with the wish : {}. Only give the number.
    Poem: {}
    Output of number:
    :""".format(wish,story)
    return prompt



def load_prompt(path):
    content = {}
    with open(path, 'r') as f:
        # if json file
        if path.endswith(".json"):
            content = json.load(f)
        # if txt file
        else:
            content = f.read()
    return content




def append_message(role, content):
    messages.append({"role": role, "content": content})
    # if messages > 2, then delete the first one

    if len(messages) > 1:
        messages.pop(0)



def formalize_few_shot_prompt(path):
    with open(path, 'r') as f:
        content = f.read()
        # change content to json
        content = json.loads(content)
        # for each example in the prompt, change to string
        prompt = ""
        for example in content:
            example["input"] = json.dumps(example["input"])
            example["output"] = json.dumps(example["output"])
            prompt += ("Example Input: "+example["input"] + "\n")

            prompt += ("Example Output: "+example["output"]+ "\n")
    return prompt



def log_used_prompt(response, interface_name):
    example_num = 1
    prompt_tokens = response.usage.prompt_tokens
    completion_tokens = response.usage.completion_tokens
    total_tokens = response.usage.total_tokens

    # formulate the above information into a string
    log_string = "----------------------------------------\n"
    log_string += "[Interface]: "+interface_name+"\n"
    log_string += "[Prompt tokens]: "+str(prompt_tokens)+"\n"
    log_string += "[Number of examples]: "+str(example_num)+"\n"
    log_string += "[Completion tokens]: "+str(completion_tokens)+"\n"
    log_string += "[Total tokens]: "+str(total_tokens)+"\n"
    # add a border
    log_string += "----------------------------------------\n"
    print(log_string)
