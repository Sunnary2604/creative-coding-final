import datetime
import json
import os
import re
import openai
from flask import Flask, redirect, render_template, request, url_for
from flask_cors import CORS
import colorsys
app = Flask(__name__)
CORS(app)
# openai.api_key = os.getenv("OPENAI_API_KEY")
# read the api key from the file
key_path = "./api.txt"
with open(key_path, 'r') as f:
    openai.api_key = f.read().strip()
    

os.environ["http_proxy"] = "127.0.0.1:7890"
os.environ["https_proxy"] = "127.0.0.1:7890"
print("开始了")

messages = []



@app.route("/getdata", methods=("GET", "POST"))
def getdata():
    if request.method == "POST":
        data = request.get_data().decode("utf-8")
        print(data)
        result = json.loads(data)
        user_input = result["user_input"]
        append_message(
            "user", generate_prompt(user_input))
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
        )
        
        log_used_prompt(response, "Step1: Get the description")
        append_message("assistant", response.choices[0].message.content)
        return response.choices[0].message.content
    result = request.args.get("result")
    return result

def generate_prompt(user_input):
    prompt = """Please give me some similar words with the keyword in the given context.
    Input: {}
    Output:""".format(user_input)
    return prompt

def create_prompt_generate_concepts(description, mode):
    prompt = ""
    color_psychology = ""
    print(mode)
    if(mode == "ColorMood"):
        prompt = formalize_few_shot_prompt(
            "./datasets/prompts/Alternative_Step1_without_ColorMood.json", -1)
    else:
        prompt = formalize_few_shot_prompt(
            "./datasets/prompts/Step1_prompt_generate_concepts.json", -1)
        color_psychology = load_prompt(
            "./datasets/prompts/Domain_Knowledge_color_psychology.txt")
    return """Please think as an interior designer. Now I wish to design the interior color of a room. Please generate 5 design theme related to the design requirement. {}
    {}
    Input:{},
    Output:""".format(color_psychology, prompt, description)




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



def formalize_few_shot_prompt(path, room_id):
    with open(path, 'r') as f:
        content = f.read()
        # change content to json
        content = json.loads(content)
        # for each example in the prompt, change to string
        prompt = ""
        if room_id == -1:
            for example in content:
                example["input"] = json.dumps(example["input"])
                example["output"] = json.dumps(example["output"])
                prompt += ("Input: "+example["input"])
                prompt += ("Output: "+example["output"])
        else:
            for example in content[room_id]:
                example["input"] = json.dumps(example["input"])
                example["output"] = json.dumps(example["output"])
                prompt += ("Input: "+example["input"])
                prompt += ("Output: "+example["output"])
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
