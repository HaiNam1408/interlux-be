import { PrismaClient, PostStatus } from '@prisma/client';
import { SlugUtil } from '../../src/utils/createSlug.util';

export async function seedBlogPosts(prisma: PrismaClient) {
    await prisma.postTag.deleteMany({});
    await prisma.post.deleteMany({});

    const tags = await prisma.tag.findMany();

    const createThumbnail = (id: number) => {
        return {
            fileName: `blog/blog-thumbnail-${id}.jpg`,
            filePath: `https://picsum.photos/seed/blog${id}/800/600`,
            type: 'image'
        };
    };

    const posts = [
        {
            title: 'How to Choose the Perfect Dining Table for Your Home',
            description: 'A comprehensive guide to selecting the ideal dining table based on your space, style, and needs.',
            content: `
<h1>How to Choose the Perfect Dining Table for Your Home</h1>

<p>The dining table is often the centerpiece of your home's dining area and a gathering place for family meals, celebrations, and everyday activities. Choosing the right dining table is essential for both functionality and aesthetics. This guide will help you navigate the options and make an informed decision.</p>

<h2>Consider Your Space</h2>

<p>Before shopping for a dining table, measure your dining area carefully:</p>

<ul>
  <li>Allow at least 36 inches (91 cm) from the table edge to the wall or other furniture</li>
  <li>For comfortable seating, each person needs about 24 inches (61 cm) of table edge</li>
  <li>The table should be proportional to the room size</li>
</ul>

<p>For small spaces, consider round or extendable tables that can adapt to different needs.</p>

<h2>Choose the Right Material</h2>

<p>Different materials offer various benefits:</p>

<h3>Wood</h3>
<ul>
  <li>Durable and timeless</li>
  <li>Available in many finishes and styles</li>
  <li>Requires regular maintenance</li>
  <li>Can be refinished if damaged</li>
</ul>

<h3>Glass</h3>
<ul>
  <li>Creates a sense of openness and space</li>
  <li>Easy to clean</li>
  <li>Shows fingerprints and dust more readily</li>
  <li>May require more frequent cleaning</li>
</ul>

<h3>Marble</h3>
<ul>
  <li>Luxurious appearance</li>
  <li>Heat-resistant</li>
  <li>Susceptible to staining</li>
  <li>Requires special care and sealing</li>
</ul>

<h3>Metal</h3>
<ul>
  <li>Modern and industrial look</li>
  <li>Extremely durable</li>
  <li>Can be cold or noisy</li>
  <li>Often combined with other materials</li>
</ul>

<h2>Select the Right Shape</h2>

<p>The shape of your dining table should complement your space:</p>

<ul>
  <li><strong>Rectangular</strong>: Traditional and accommodates many people</li>
  <li><strong>Round</strong>: Encourages conversation and works well in smaller spaces</li>
  <li><strong>Square</strong>: Modern look, perfect for square rooms</li>
  <li><strong>Oval</strong>: Combines benefits of rectangular and round tables</li>
</ul>

<h2>Consider Your Lifestyle</h2>

<p>Think about how you'll use the table:</p>

<ul>
  <li>For families with children, choose durable materials that resist scratches</li>
  <li>If you entertain frequently, consider extendable tables</li>
  <li>For multipurpose use (work, crafts, dining), select a sturdy, versatile design</li>
</ul>

<h2>Budget Considerations</h2>

<p>Quality dining tables can be an investment:</p>

<ul>
  <li>Solid wood tables are typically more expensive but last longer</li>
  <li>Veneer over engineered wood offers a wood look at a lower price</li>
  <li>Consider long-term value rather than just initial cost</li>
</ul>

<h2>Maintenance Requirements</h2>

<p>Different materials and finishes require varying levels of care:</p>

<ul>
  <li>Wood tables may need regular polishing and protection from moisture</li>
  <li>Glass tables require frequent cleaning to maintain their appearance</li>
  <li>Metal tables are generally low-maintenance but may show fingerprints</li>
</ul>

<p>By considering these factors, you'll be able to select a dining table that not only looks beautiful in your home but also serves your needs for years to come.</p>
            `,
            status: PostStatus.PUBLISHED,
            publishedAt: new Date('2024-05-15'),
            tagIds: [tags.find(t => t.name === 'Dining Room')?.id, tags.find(t => t.name === 'Furniture')?.id, tags.find(t => t.name === 'Design')?.id].filter(Boolean),
            view: 245
        },
        {
            title: 'Interior Design Trends for 2024',
            description: 'Discover the hottest interior design trends that are shaping homes this year.',
            content: `
<h1>Interior Design Trends for 2024</h1>

<p>As we move through 2024, several distinct interior design trends are emerging that reflect our changing lifestyles, environmental concerns, and aesthetic preferences. Here's a look at what's trending in home design this year.</p>

<h2>Biophilic Design Continues to Flourish</h2>

<p>The connection between humans and nature remains a strong influence in interior design:</p>

<ul>
  <li>Living walls and extensive indoor plants</li>
  <li>Natural materials like wood, stone, and clay</li>
  <li>Organic shapes and forms in furniture and decor</li>
  <li>Nature-inspired color palettes</li>
</ul>

<h2>Sustainable and Ethical Choices</h2>

<p>Sustainability is no longer just a trend but a necessity:</p>

<ul>
  <li>Furniture made from recycled or reclaimed materials</li>
  <li>Vintage and second-hand pieces gaining popularity</li>
  <li>Energy-efficient appliances and fixtures</li>
  <li>Low-VOC paints and natural finishes</li>
</ul>

<h2>Multifunctional Spaces</h2>

<p>As remote work continues to be common, adaptable spaces are essential:</p>

<ul>
  <li>Convertible furniture that serves multiple purposes</li>
  <li>Room dividers and modular systems</li>
  <li>Built-in storage solutions that maximize space</li>
  <li>Flexible layouts that can change with needs</li>
</ul>

<h2>Rich, Bold Colors</h2>

<p>After years of neutrals dominating, bold colors are making a comeback:</p>

<ul>
  <li>Deep, saturated blues and greens</li>
  <li>Terracotta and rust tones</li>
  <li>Jewel tones like emerald and sapphire</li>
  <li>Unexpected color combinations and color blocking</li>
</ul>

<h2>Curved and Organic Forms</h2>

<p>Moving away from strict minimalism, organic shapes are trending:</p>

<ul>
  <li>Curved sofas and rounded armchairs</li>
  <li>Irregular shapes in tables and accessories</li>
  <li>Arched doorways and architectural details</li>
  <li>Sculptural lighting fixtures</li>
</ul>

<h2>Textural Diversity</h2>

<p>Texture is becoming as important as color in creating visual interest:</p>

<ul>
  <li>Bouclé fabrics continuing their popularity</li>
  <li>Tactile materials like ribbed wood and fluted glass</li>
  <li>Layering different textures within a space</li>
  <li>3D wall treatments and textured wallpapers</li>
</ul>

<h2>Global Influences</h2>

<p>Cultural fusion and global inspiration are evident in:</p>

<ul>
  <li>Handcrafted items from around the world</li>
  <li>Traditional patterns reimagined in modern contexts</li>
  <li>Mixing design elements from different cultures</li>
  <li>Artisanal techniques and craftsmanship</li>
</ul>

<h2>Tech-Integrated Living</h2>

<p>Smart home features are becoming more seamless:</p>

<ul>
  <li>Hidden technology that doesn't disrupt aesthetics</li>
  <li>Voice-activated systems integrated into design</li>
  <li>Wireless charging stations built into furniture</li>
  <li>Smart lighting systems for ambiance and function</li>
</ul>

<p>By incorporating these trends thoughtfully, you can create a home that feels both current and timeless, reflecting your personal style while embracing the design direction of 2024.</p>
            `,
            status: PostStatus.PUBLISHED,
            publishedAt: new Date('2024-06-02'),
            tagIds: [tags.find(t => t.name === 'Design')?.id, tags.find(t => t.name === 'Trends')?.id, tags.find(t => t.name === 'Modern Style')?.id].filter(Boolean),
            view: 378
        },
        {
            title: 'Small Space Solutions: Maximizing Your Home Office',
            description: 'Creative ideas for setting up a productive home office in limited space.',
            content: `
<h1>Small Space Solutions: Maximizing Your Home Office</h1>

<p>Creating a functional home office in a small space can be challenging, but with thoughtful planning and creative solutions, you can design a productive workspace regardless of square footage. Here are practical strategies to maximize your home office in limited space.</p>

<h2>Choose the Right Location</h2>

<p>Finding the optimal spot for your home office is crucial:</p>

<ul>
  <li>Look for underutilized nooks, corners, or wall space</li>
  <li>Consider converting a closet into a "cloffice" (closet office)</li>
  <li>Use room dividers or screens to create a dedicated zone</li>
  <li>Evaluate natural light availability for your chosen space</li>
</ul>

<h2>Space-Saving Desk Options</h2>

<p>Your desk is the foundation of your workspace:</p>

<ul>
  <li>Wall-mounted desks that fold away when not in use</li>
  <li>Corner desks that maximize awkward spaces</li>
  <li>Floating desks that don't require floor space</li>
  <li>Narrow console tables that can double as desks</li>
</ul>

<h2>Vertical Storage Solutions</h2>

<p>When floor space is limited, think upward:</p>

<ul>
  <li>Wall-mounted shelving above your desk</li>
  <li>Pegboards for frequently used items</li>
  <li>Vertical file organizers</li>
  <li>Stackable storage containers</li>
</ul>

<h2>Multi-Functional Furniture</h2>

<p>Each piece should serve multiple purposes:</p>

<ul>
  <li>Desks with built-in storage</li>
  <li>Ottoman seating with hidden storage</li>
  <li>Nesting tables that can expand when needed</li>
  <li>Convertible furniture that adapts to different needs</li>
</ul>

<h2>Cable Management</h2>

<p>Keeping cords organized is essential in small spaces:</p>

<ul>
  <li>Wireless peripherals when possible</li>
  <li>Cable clips and organizers</li>
  <li>Power strips mounted under the desk</li>
  <li>Cord covers that blend with baseboards</li>
</ul>

<h2>Lighting Considerations</h2>

<p>Proper lighting improves functionality and mood:</p>

<ul>
  <li>Task lighting that doesn't require desk space (wall-mounted or clamp-on)</li>
  <li>LED strip lighting under shelves</li>
  <li>Adjustable lighting for different times of day</li>
  <li>Light colors and mirrors to enhance natural light</li>
</ul>

<h2>Minimize Visual Clutter</h2>

<p>A clean, organized space feels larger:</p>

<ul>
  <li>Digital file storage instead of paper when possible</li>
  <li>Hidden storage for supplies and equipment</li>
  <li>Consistent color scheme to create visual harmony</li>
  <li>Regular decluttering routine</li>
</ul>

<h2>Ergonomic Considerations</h2>

<p>Don't sacrifice comfort for space:</p>

<ul>
  <li>Properly sized chair that tucks completely under the desk</li>
  <li>Monitor at eye level (wall-mounted if necessary)</li>
  <li>Keyboard at the right height for typing</li>
  <li>Footrest if needed for proper posture</li>
</ul>

<p>By implementing these strategies, you can create a home office that maximizes productivity while minimizing the space required. Remember that even the smallest dedicated workspace can be effective with thoughtful organization and design.</p>
            `,
            status: PostStatus.PUBLISHED,
            publishedAt: new Date('2024-06-10'),
            tagIds: [tags.find(t => t.name === 'Home Office')?.id, tags.find(t => t.name === 'Small Spaces')?.id, tags.find(t => t.name === 'Furniture')?.id].filter(Boolean),
            view: 156
        },
        {
            title: 'The Art of Mixing Wood Tones in Interior Design',
            description: 'Learn how to successfully combine different wood finishes for a cohesive and stylish home.',
            content: `
<h1>The Art of Mixing Wood Tones in Interior Design</h1>

<p>Mixing wood tones in your home can add depth, character, and visual interest to your spaces. However, many people feel intimidated by combining different wood finishes, fearing the result will look mismatched or uncoordinated. With a few guiding principles, you can confidently mix wood tones to create a rich, layered look.</p>

<h2>Why Mix Wood Tones?</h2>

<p>Before diving into how to mix wood tones, let's consider why it's worth doing:</p>

<ul>
  <li>Creates a collected-over-time, authentic feel</li>
  <li>Adds warmth and dimension to spaces</li>
  <li>Allows flexibility when adding new pieces</li>
  <li>Prevents the monotonous look of perfectly matched furniture</li>
</ul>

<h2>Start with a Dominant Wood Tone</h2>

<p>Begin by identifying or establishing a dominant wood tone:</p>

<ul>
  <li>Often this comes from flooring or large furniture pieces</li>
  <li>This dominant tone will anchor the space</li>
  <li>Aim for this tone to represent about 60% of the wood in the room</li>
  <li>Other wood tones will complement this primary finish</li>
</ul>

<h2>Consider Undertones</h2>

<p>Wood finishes have underlying tones that affect how they work together:</p>

<ul>
  <li>Warm undertones: red, orange, yellow</li>
  <li>Cool undertones: gray, ash, bluish</li>
  <li>Try to maintain some consistency in undertones</li>
  <li>When mixing warm and cool, ensure there's enough contrast</li>
</ul>

<h2>Create Intentional Contrast</h2>

<p>Contrast helps different wood tones look deliberate rather than mismatched:</p>

<ul>
  <li>Pair light woods with medium or dark woods</li>
  <li>High contrast (very light with very dark) often works better than slight variations</li>
  <li>Use contrast to highlight special pieces</li>
  <li>Ensure contrast is distributed throughout the space</li>
</ul>

<h2>Use Connecting Elements</h2>

<p>Create cohesion between different wood tones with:</p>

<ul>
  <li>Similar design styles across wooden pieces</li>
  <li>Consistent hardware finishes</li>
  <li>Textiles that incorporate multiple wood tones in their pattern</li>
  <li>Paint colors that complement all the wood tones present</li>
</ul>

<h2>Consider Distribution and Balance</h2>

<p>How you arrange different wood tones affects the overall harmony:</p>

<ul>
  <li>Distribute various wood tones throughout the space</li>
  <li>Avoid clustering all of one tone in a single area</li>
  <li>Create visual triangles with similar tones</li>
  <li>Balance is more important than perfect symmetry</li>
</ul>

<h2>Use Buffers Between Wood Pieces</h2>

<p>When different wood tones are directly adjacent:</p>

<ul>
  <li>Add a buffer like a rug, textile, or painted piece</li>
  <li>Use metal, glass, or stone elements to break up wood expanses</li>
  <li>Consider painted furniture to reduce wood tone overload</li>
  <li>Use upholstered pieces between wooden furniture</li>
</ul>

<h2>Trust Your Eye</h2>

<p>Ultimately, successful wood tone mixing comes down to what looks good to you:</p>

<ul>
  <li>Step back and assess the overall effect</li>
  <li>Take photos to see the space with fresh eyes</li>
  <li>Adjust if certain areas feel unbalanced</li>
  <li>Remember that perfect matching is neither necessary nor desirable</li>
</ul>

<p>By following these principles, you can confidently mix wood tones to create spaces with depth, character, and timeless appeal.</p>
            `,
            status: PostStatus.PUBLISHED,
            publishedAt: new Date('2024-06-18'),
            tagIds: [tags.find(t => t.name === 'Design')?.id, tags.find(t => t.name === 'Natural Wood')?.id, tags.find(t => t.name === 'Decoration Tips')?.id].filter(Boolean),
            view: 203
        },
        {
            title: 'Sustainable Furniture: Eco-Friendly Choices for Modern Homes',
            description: 'A guide to selecting environmentally responsible furniture without compromising on style.',
            content: `
<h1>Sustainable Furniture: Eco-Friendly Choices for Modern Homes</h1>

<p>As environmental awareness grows, many homeowners are seeking sustainable furniture options that reduce their ecological footprint while still providing style, comfort, and durability. This guide explores how to make environmentally responsible furniture choices for your home.</p>

<h2>Understanding Sustainable Furniture</h2>

<p>Sustainable furniture generally meets several criteria:</p>

<ul>
  <li>Made from renewable, recycled, or reclaimed materials</li>
  <li>Produced using environmentally responsible manufacturing processes</li>
  <li>Durable and designed for longevity</li>
  <li>Recyclable or biodegradable at the end of its life cycle</li>
  <li>Created with minimal waste and pollution</li>
</ul>

<h2>Sustainable Materials to Look For</h2>

<h3>Certified Wood</h3>
<ul>
  <li>FSC (Forest Stewardship Council) certification ensures responsible forestry</li>
  <li>Look for woods from rapidly renewable sources like bamboo and mango</li>
  <li>Reclaimed or salvaged wood gives new life to existing materials</li>
</ul>

<h3>Recycled and Upcycled Materials</h3>
<ul>
  <li>Furniture made from recycled metals, plastics, or textiles</li>
  <li>Upcycled pieces that transform waste into functional items</li>
  <li>Post-consumer recycled content reduces landfill waste</li>
</ul>

<h3>Natural and Organic Materials</h3>
<ul>
  <li>Organic cotton, wool, and hemp for upholstery</li>
  <li>Natural latex for cushioning instead of petroleum-based foams</li>
  <li>Jute, sisal, and seagrass for textural elements</li>
</ul>

<h2>Evaluating Manufacturing Processes</h2>

<p>Sustainable furniture production involves:</p>

<ul>
  <li>Low-emission manufacturing facilities</li>
  <li>Water conservation practices</li>
  <li>Renewable energy usage</li>
  <li>Non-toxic finishes and adhesives</li>
  <li>Local production to reduce transportation impact</li>
</ul>

<h2>Durability and Timeless Design</h2>

<p>Sustainability extends beyond materials to include:</p>

<ul>
  <li>Quality construction that ensures longevity</li>
  <li>Classic designs that won't quickly become outdated</li>
  <li>Adaptable pieces that can serve multiple functions</li>
  <li>Furniture that can be repaired rather than replaced</li>
</ul>

<h2>Certifications and Standards to Know</h2>

<p>Look for these credible eco-certifications:</p>

<ul>
  <li>GREENGUARD (low chemical emissions)</li>
  <li>Global Organic Textile Standard (GOTS)</li>
  <li>BIFMA LEVEL (sustainability assessment for furniture)</li>
  <li>Cradle to Cradle (holistic product assessment)</li>
  <li>SFC (Sustainable Furnishings Council) membership</li>
</ul>

<h2>Sustainable Furniture Brands</h2>

<p>Many companies now prioritize sustainability:</p>

<ul>
  <li>Established manufacturers with transparent sustainability initiatives</li>
  <li>Smaller artisanal brands using traditional, low-impact methods</li>
  <li>Local craftspeople using regional materials</li>
  <li>Vintage and secondhand retailers extending furniture lifecycles</li>
</ul>

<h2>The True Cost Perspective</h2>

<p>When evaluating sustainable furniture:</p>

<ul>
  <li>Consider the lifetime cost rather than just purchase price</li>
  <li>Factor in durability and potential for repair</li>
  <li>Assess the environmental and social costs of cheaper alternatives</li>
  <li>View quality furniture as an investment rather than a disposable item</li>
</ul>

<p>By making informed choices about sustainable furniture, you can create a beautiful, comfortable home that aligns with your environmental values and contributes to a healthier planet.</p>
            `,
            status: PostStatus.PUBLISHED,
            publishedAt: new Date('2024-06-25'),
            tagIds: [tags.find(t => t.name === 'Sustainable Materials')?.id, tags.find(t => t.name === 'Furniture')?.id, tags.find(t => t.name === 'Trends')?.id].filter(Boolean),
            view: 189
        },
        {
            title: 'Creating a Cozy Reading Nook in Any Home',
            description: 'Tips for designing the perfect reading corner, no matter your space constraints.',
            content: `
<h1>Creating a Cozy Reading Nook in Any Home</h1>

<p>A dedicated reading nook can become your favorite spot to unwind, escape into a good book, and enjoy moments of quiet reflection. The good news is that you don't need a large space to create a comfortable reading corner. With thoughtful design and a few key elements, you can carve out a cozy reading nook in virtually any home.</p>

<h2>Finding the Perfect Spot</h2>

<p>The first step is identifying the right location:</p>

<ul>
  <li>Look for unused corners, window seats, or alcoves</li>
  <li>Consider spaces under stairs or in hallway ends</li>
  <li>Repurpose part of a larger room with strategic furniture placement</li>
  <li>Evaluate natural light availability throughout the day</li>
</ul>

<h2>Essential Elements of a Reading Nook</h2>

<h3>Comfortable Seating</h3>

<p>The foundation of any reading nook is a comfortable place to sit:</p>

<ul>
  <li>Plush armchairs with good back support</li>
  <li>Window seats with cushions</li>
  <li>Chaise lounges for stretching out</li>
  <li>Floor cushions or bean bags for casual settings</li>
  <li>Small loveseats if space permits</li>
</ul>

<h3>Proper Lighting</h3>

<p>Good lighting is crucial for comfortable reading:</p>

<ul>
  <li>Position the nook near a window for natural light when possible</li>
  <li>Include a dedicated reading lamp with adjustable brightness</li>
  <li>Consider wall-mounted lights to save space</li>
  <li>Layer lighting with ambient and task options</li>
  <li>Ensure the light source is positioned to avoid glare</li>
</ul>

<h3>Storage Solutions</h3>

<p>Keep reading materials organized and accessible:</p>

<ul>
  <li>Floating shelves above or beside the seating</li>
  <li>Small bookcases or built-ins if space allows</li>
  <li>Magazine racks or wall pockets</li>
  <li>Under-seat storage in window seats or ottomans</li>
  <li>Nearby baskets for current reading materials</li>
</ul>

<h2>Creating Comfort and Ambiance</h2>

<h3>Soft Textiles</h3>

<p>Add warmth and coziness with:</p>

<ul>
  <li>Throw blankets for chilly reading sessions</li>
  <li>Plush pillows for back support and comfort</li>
  <li>Soft area rugs to define the space</li>
  <li>Window treatments to control light and add privacy</li>
</ul>

<h3>Personal Touches</h3>

<p>Make the space uniquely yours with:</p>

<ul>
  <li>Meaningful artwork or photographs</li>
  <li>Plants to add life and improve air quality</li>
  <li>A small side table for beverages and snacks</li>
  <li>Scented candles or diffusers (used safely)</li>
  <li>Personal mementos that bring joy</li>
</ul>

<h2>Space-Saving Ideas for Small Homes</h2>

<p>When space is at a premium:</p>

<ul>
  <li>Use multifunctional furniture like storage ottomans</li>
  <li>Install wall-mounted lighting instead of floor lamps</li>
  <li>Choose a chair that can serve other purposes when needed</li>
  <li>Utilize vertical space with tall, narrow bookshelves</li>
  <li>Consider a folding screen to create a temporary nook</li>
</ul>

<h2>Seasonal Refreshes</h2>

<p>Keep your reading nook inviting year-round:</p>

<ul>
  <li>Lighter fabrics and colors for summer</li>
  <li>Heavier textiles and warmer tones for winter</li>
  <li>Seasonal decorative elements to maintain interest</li>
  <li>Rotating your book display to feature seasonal reads</li>
</ul>

<p>By thoughtfully combining these elements, you can create a reading nook that becomes a sanctuary for relaxation and literary enjoyment, regardless of your home's size or layout.</p>
            `,
            status: PostStatus.PUBLISHED,
            publishedAt: new Date('2024-07-01'),
            tagIds: [tags.find(t => t.name === 'Small Spaces')?.id, tags.find(t => t.name === 'Decoration Tips')?.id, tags.find(t => t.name === 'Living Room')?.id].filter(Boolean),
            view: 142
        },
        {
            title: 'Lighting Design 101: Enhancing Your Home with Strategic Illumination',
            description: 'Master the basics of home lighting design to create atmosphere, functionality, and visual appeal.',
            content: `
<h1>Lighting Design 101: Enhancing Your Home with Strategic Illumination</h1>

<p>Effective lighting design goes far beyond basic illumination—it can transform spaces, highlight architectural features, create ambiance, and significantly impact how we experience our homes. Understanding the fundamentals of lighting design can help you create spaces that are both functional and beautiful.</p>

<h2>The Three Layers of Lighting</h2>

<p>A well-designed lighting plan incorporates three essential layers:</p>

<h3>Ambient (General) Lighting</h3>

<p>This provides overall illumination for the room:</p>

<ul>
  <li>Ceiling-mounted fixtures</li>
  <li>Recessed lighting</li>
  <li>Track lighting</li>
  <li>Wall-mounted fixtures</li>
  <li>Natural light from windows</li>
</ul>

<h3>Task Lighting</h3>

<p>Focused lighting for specific activities:</p>

<ul>
  <li>Reading lamps</li>
  <li>Under-cabinet kitchen lighting</li>
  <li>Desk lamps</li>
  <li>Bathroom vanity lighting</li>
  <li>Pendant lights over work areas</li>
</ul>

<h3>Accent Lighting</h3>

<p>Decorative lighting that adds drama and highlights features:</p>

<ul>
  <li>Picture lights</li>
  <li>Wall sconces</li>
  <li>Uplighting for plants or architectural elements</li>
  <li>Display lighting for collections</li>
  <li>LED strips for coves or shelving</li>
</ul>

<h2>Room-by-Room Lighting Strategies</h2>

<h3>Living Room</h3>

<ul>
  <li>Combine overhead lighting with floor and table lamps</li>
  <li>Include task lighting near reading areas</li>
  <li>Use dimmers to adjust for different activities</li>
  <li>Consider wall sconces to add warmth and reduce shadows</li>
</ul>

<h3>Kitchen</h3>

<ul>
  <li>Bright, even overhead lighting for general tasks</li>
  <li>Under-cabinet lighting for food preparation</li>
  <li>Pendant lighting over islands and dining areas</li>
  <li>Consider toe-kick lighting for nighttime navigation</li>
</ul>

<h3>Bedroom</h3>

<ul>
  <li>Soft, ambient lighting for relaxation</li>
  <li>Bedside reading lamps or wall-mounted fixtures</li>
  <li>Closet lighting for functionality</li>
  <li>Consider a dimmer for the main light source</li>
</ul>

<h3>Bathroom</h3>

<ul>
  <li>Even facial lighting at the vanity (avoid overhead-only)</li>
  <li>Waterproof lighting in shower areas</li>
  <li>Night lighting for safety</li>
  <li>Consider both cool and warm lighting options</li>
</ul>

<h2>Light Bulb Selection</h2>

<p>The type of bulb significantly affects the quality of light:</p>

<h3>Color Temperature</h3>

<ul>
  <li>Warm white (2700-3000K): Cozy, relaxing spaces</li>
  <li>Neutral white (3500-4100K): Workspaces, kitchens</li>
  <li>Cool white (5000-6500K): Task-focused areas, garages</li>
</ul>

<h3>Bulb Types</h3>

<ul>
  <li>LED: Energy-efficient, long-lasting, versatile</li>
  <li>CFL: Energy-efficient but contains mercury</li>
  <li>Halogen: Good color rendering but less efficient</li>
  <li>Incandescent: Warm light but inefficient and short-lived</li>
</ul>

<h2>Control Systems</h2>

<p>How you control your lighting affects both convenience and energy use:</p>

<ul>
  <li>Dimmers for flexibility in light levels</li>
  <li>Smart lighting systems for programmable control</li>
  <li>Motion sensors for utility spaces</li>
  <li>Timers for security and convenience</li>
  <li>Zone controls for large spaces</li>
</ul>

<h2>Common Lighting Mistakes to Avoid</h2>

<ul>
  <li>Relying solely on one central ceiling fixture</li>
  <li>Insufficient lighting for tasks</li>
  <li>Ignoring the importance of layered lighting</li>
  <li>Choosing fixtures that are too small for the space</li>
  <li>Incorrect placement causing glare or shadows</li>
</ul>

<h2>Energy Efficiency Considerations</h2>

<ul>
  <li>Use LED bulbs for significant energy savings</li>
  <li>Install dimmers to reduce energy when full brightness isn't needed</li>
  <li>Consider natural light in your overall lighting plan</li>
  <li>Use timers and motion sensors to avoid wasting electricity</li>
  <li>Look for ENERGY STAR rated fixtures and bulbs</li>
</ul>

<p>By thoughtfully applying these lighting design principles, you can enhance the functionality, comfort, and aesthetic appeal of every room in your home.</p>
            `,
            status: PostStatus.PUBLISHED,
            publishedAt: new Date('2024-07-05'),
            tagIds: [tags.find(t => t.name === 'Lighting')?.id, tags.find(t => t.name === 'Design')?.id, tags.find(t => t.name === 'Decoration Tips')?.id].filter(Boolean),
            view: 167
        },
        {
            title: 'Upcoming Summer Sale: Get Up to 50% Off on Selected Items',
            description: 'Don\'t miss our biggest sale of the season with amazing discounts on furniture and home decor.',
            content: `
<h1>Upcoming Summer Sale: Get Up to 50% Off on Selected Items</h1>

<p>We're excited to announce our biggest sale of the season! Starting July 15th, enjoy incredible discounts on a wide range of furniture and home decor items. This is the perfect opportunity to refresh your living spaces with quality pieces at exceptional prices.</p>

<h2>Sale Highlights</h2>

<h3>Furniture Discounts</h3>

<ul>
  <li><strong>Living Room</strong>: Up to 40% off sofas, armchairs, and coffee tables</li>
  <li><strong>Dining Room</strong>: Up to 35% off dining tables and chairs</li>
  <li><strong>Bedroom</strong>: Up to 45% off bed frames, nightstands, and dressers</li>
  <li><strong>Home Office</strong>: Up to 30% off desks, office chairs, and bookshelves</li>
</ul>

<h3>Special Offers</h3>

<ul>
  <li><strong>Early Bird Special</strong>: Additional 10% off for purchases made in the first 48 hours</li>
  <li><strong>Bundle Deals</strong>: Save extra when you purchase complete room sets</li>
  <li><strong>Free Delivery</strong>: On orders over $1,000</li>
  <li><strong>Extended Warranty</strong>: Complimentary extended warranty on selected premium items</li>
</ul>

<h2>Featured Products</h2>

<h3>Artisan Dining Table</h3>
<ul>
  <li>Regular Price: $2,800</li>
  <li>Sale Price: $1,680 (40% off)</li>
  <li>Handcrafted from sustainable hardwood with a natural finish</li>
</ul>

<h3>Modern Sectional Sofa</h3>
<ul>
  <li>Regular Price: $3,200</li>
  <li>Sale Price: $1,920 (40% off)</li>
  <li>Premium fabric upholstery with modular design</li>
</ul>

<h3>Luxury King Bed Frame</h3>
<ul>
  <li>Regular Price: $1,950</li>
  <li>Sale Price: $1,072 (45% off)</li>
  <li>Solid wood construction with integrated storage</li>
</ul>

<h2>Shopping Information</h2>

<h3>Sale Dates</h3>
<ul>
  <li><strong>Start</strong>: July 15, 2024</li>
  <li><strong>End</strong>: July 31, 2024</li>
</ul>

<h3>How to Shop</h3>
<ul>
  <li><strong>In-Store</strong>: Visit our showroom for personalized assistance</li>
  <li><strong>Online</strong>: Browse our complete selection at [website]</li>
  <li><strong>Phone</strong>: Call our customer service for phone orders</li>
</ul>

<h3>Payment Options</h3>
<ul>
  <li>Major credit cards accepted</li>
  <li>Interest-free financing available for qualified customers</li>
  <li>Layaway plans available</li>
</ul>

<h2>Additional Information</h2>

<ul>
  <li>All sales are final on clearance items</li>
  <li>Regular return policy applies to non-clearance merchandise</li>
  <li>While supplies last; no rain checks</li>
  <li>Cannot be combined with other promotional offers</li>
</ul>

<p>Don't miss this opportunity to transform your home with beautiful, high-quality furniture at exceptional prices. Mark your calendar and prepare to shop our Summer Sale starting July 15th!</p>
            `,
            status: PostStatus.DRAFT,
            publishedAt: null,
            tagIds: [tags.find(t => t.name === 'Promotions')?.id, tags.find(t => t.name === 'New Products')?.id].filter(Boolean),
            view: 0
        }
    ];

    // Create posts and associate tags
    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const slug = SlugUtil.createSlug(post.title);

        const createdPost = await prisma.post.create({
            data: {
                title: post.title,
                slug: slug,
                description: post.description,
                content: post.content,
                status: post.status,
                publishedAt: post.publishedAt,
                view: post.view,
                thumbnail: createThumbnail(i + 1)
            }
        });

        // Create post-tag relationships
        if (post.tagIds && post.tagIds.length > 0) {
            for (const tagId of post.tagIds) {
                await prisma.postTag.create({
                    data: {
                        postId: createdPost.id,
                        tagId: tagId
                    }
                });
            }
        }
    }

    console.log(`Created ${posts.length} blog posts`);
}
