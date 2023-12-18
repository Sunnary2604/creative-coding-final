# Overall framework
Goal: Make the unknown known, pretend to be a wizard and help people to make their wishes come true.
(how to guide player when they not know what to do?) 
To reach a specific wish, what should we do? 
1. Right time -> planetary hours -> background ring rotating (not now)
2. Right thing -> form the right prayer -> click key words and see how the prayer changes (each key word has a attribute, and the prayer is formed by the combination of the attributes) user: infer the connection between the user's wish and the attributes. 
relation with the world tree:
2. the wish is sent to the backend
3. the backend classify the wish, and generate related wishes
4. the frontend display the related wishes (keywords)
5. the user choose some of the keywords, send them to the backend
6. backend form the prayer, and send it to the frontend
7. frontend display the prayer

## Frontend

## Backend
clasification for the wishes






1. 保留大树和部分树枝，在地上放置若干个苹果，每个苹果代表一种wish，然后会有提示词提示用户将苹果拖拽到指定位置去播种；

2. 在生成基于用户投种的wish词（等待gpt反馈）的过程中，会有树苗从土里冒出，然后演变成最后的大树，然后树冠处生成相关的关联词。

3. 关键词之间会有联系，形成一定的连贯结构，并且可以根据用户调整新的输入关键词去构建新的内容展示。其中的动画展示会有一定的升华优化。